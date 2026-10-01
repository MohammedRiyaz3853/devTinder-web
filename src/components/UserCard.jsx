import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { useState } from 'react'

const UserCard = ({ user, onSwipe }) => {
  if (!user) return null;
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);

  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  
  const interestedOpacity = useTransform(x, [20, 100], [0, 1]);
  const ignoreOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      
      setExitX(500);
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe?.('interested', user);
    } else if (info.offset.x < -threshold) {
      
      setExitX(-500);
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe?.('ignored', user);
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 500, damping: 50 } });
    }
  };

  return (
    <div className="flex justify-center mt-8 relative h-">

      
      <div className="absolute w- h- bg-base-200 rounded- rotate-3"></div>
      <div className="absolute w- h- bg-base-200 rounded- rotate-1"></div>

      <motion.div
        drag="x"
        style={{ x, rotate }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="card w-[320px] h-[480px] bg-base-100 shadow-2xl rounded- overflow-hidden border border-base-200 cursor-grab active:cursor-grabbing z-10"
      >
        
        <motion.div style={{ opacity: interestedOpacity }} className="absolute top-6 left-6 z-20 border- border-green-500 text-green-500 font-black text-2xl px-4 py-1 rounded-lg rotate-[-20deg] tracking-widest">
          INTERESTED 
        </motion.div>
        <motion.div style={{ opacity: ignoreOpacity }} className="absolute top-6 right-6 z-20 border- border-red-500 text-red-500 font-black text-2xl px-4 py-1 rounded-lg rotate- tracking-widest">
          IGNORE 
        </motion.div>

        {/* Image */}
        <figure className="relative h-[70%] overflow-hidden pointer-events-none">
          <img
            src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            alt={`${user.firstName}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-end gap-2">
              <h2 className="text-3xl font-bold">{firstName} {lastName}</h2>
              {age && <span className="text-xl font-light mb-1">{age}</span>}
            </div>
            <p className="text-sm opacity-80 capitalize flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> {gender}
            </p>
          </div>
        </figure>

        <div className="card-body p-5 bg-base-100 h-[30%]">
          <p className="text- opacity-70 line-clamp-2">{about || "Let's build something amazing together."}</p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills?.slice(0, 4).map((s, i) => (
              <span key={i} className="badge badge-outline badge-sm">{s}</span>
            ))}
          </div>

          <div className="flex justify-between mt-auto pt-2">
              
              <button 
                onClick={async () => { 
                  setExitX(-500); 
                  await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
                  onSwipe?.('ignored', user);
                }} 
                className="btn btn-circle btn-lg btn-outline hover:btn-error shadow-md"
              >
                ✕
              </button>

              
              <button 
                onClick={async () => { 
                  setExitX(500); 
                  await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
                  onSwipe?.('interested', user);
                }} 
                className="btn btn-circle btn-lg bg-gradient-to-br from-pink-500 to-rose-500 border-none text-white shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform"
              >
                ♥
              </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserCard