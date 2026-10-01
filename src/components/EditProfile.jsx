import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL, DEFAULT_PHOTO } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', gender: '', about: '', skills: [], photoUrl: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(DEFAULT_PHOTO);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || '',
        gender: user.gender || '',
        about: user.about || '',
        skills: user.skills || [],
        photoUrl: user.photoUrl || '',
      });
      const isDirtyLink = user.photoUrl?.includes('ongcvidesh.com');
      setPhotoPreview(isDirtyLink ||!user.photoUrl? DEFAULT_PHOTO : user.photoUrl);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    return (
      formData.firstName!== (user.firstName || '') ||
      formData.lastName!== (user.lastName || '') ||
      String(formData.age)!== String(user.age || '') ||
      formData.gender!== (user.gender || '') ||
      formData.about!== (user.about || '') ||
      JSON.stringify(formData.skills)!== JSON.stringify(user.skills || []) ||
      photoFile!== null
    );
  }, [formData, user, photoFile]);

  const displayPhoto = photoFile
   ? photoPreview
    : (formData.photoUrl &&!formData.photoUrl.includes('ongcvidesh.com')? formData.photoUrl : DEFAULT_PHOTO);

  const previewUser = {
   ...user,
   ...formData,
    photoUrl: displayPhoto,
  };

  // THIS WAS MISSING IN YOUR RUNNING FILE - ADDED BACK
  const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            setToast("Image too large, pick < 10MB");
            return;
        }
        if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({...formData, skills: formData.skills.filter(s => s!== skillToRemove) });
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("firstName", formData.firstName);
      fd.append("lastName", formData.lastName);
      fd.append("age", formData.age);
      fd.append("gender", formData.gender);
      fd.append("about", formData.about);
      fd.append("skills", JSON.stringify(formData.skills));
      if (photoFile) fd.append("photo", photoFile);

      const res = await axios.patch(BASE_URL + "/profile/edit", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addUser(res.data));
      setFormData(prev => ({...prev, photoUrl: res.data.photoUrl }));
      setPhotoPreview(res.data.photoUrl);
      setPhotoFile(null);
      setToast('Profile saved! ✅');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success"><span>{toast}</span></div>
        </div>
      )}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 justify-center">
        <div className="card bg-base-100 shadow-xl w-full lg:w- p-8">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="avatar">
              <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img src={displayPhoto} alt="preview" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline" onClick={() => fileInputRef.current?.click()}>Change Photo</button>
              {photoFile && <span className="text-xs opacity-60 mt-2">New photo selected</span>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">First Name</span></label>
              <input type="text" className="input input-bordered" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Last Name</span></label>
              <input type="text" className="input input-bordered" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Age</span></label>
              <input type="number" className="input input-bordered" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Gender</span></label>
              <select className="select select-bordered" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value })}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-control mt-4">
            <label className="label"><span className="label-text">About</span></label>
            <textarea className="textarea textarea-bordered h-24" value={formData.about} onChange={(e) => setFormData({...formData, about: e.target.value })} maxLength={200}></textarea>
            <label className="label"><span className="label-text-alt opacity-50">{formData.about.length}/200</span></label>
          </div>

          <div className="form-control mt-2">
            <label className="label"><span className="label-text">Skills (press Enter)</span></label>
            <input type="text" className="input input-bordered" placeholder="JavaScript, React..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} />
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill) => (
                <div key={skill} className="badge badge-primary gap-2 p-3">{skill}<button onClick={() => removeSkill(skill)}>✕</button></div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary w-full mt-8" disabled={!isDirty || isSaving} onClick={handleSave}>
            {isSaving? <span className="loading loading-spinner"></span> : 'Save Profile'}
          </button>
          {!isDirty && <p className="text-xs text-center opacity-50 mt-2">Make changes to enable Save</p>}
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 opacity-70">Live Preview</h3>
          <div className="card w-80 bg-base-100 shadow-xl overflow-hidden rounded-2xl">
            <figure className="relative h-">
              <img src={displayPhoto} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 p-5 text-white">
                <h2 className="text-2xl font-bold">{previewUser.firstName} {previewUser.lastName}{previewUser.age && <span className="font-light">, {previewUser.age}</span>}</h2>
                {previewUser.gender && <p className="text-sm opacity-80 capitalize">{previewUser.gender}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewUser.skills?.slice(0,3).map(s => (<span key={s} className="badge badge-sm badge-outline text-white border-white/50">{s}</span>))}
                </div>
              </div>
            </figure>
            <div className="card-body p-4">
              <p className="text-sm opacity-70 line-clamp-3">{previewUser.about || "Your about will appear here..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;