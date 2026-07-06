import React from 'react';
import { motion } from 'framer-motion';

export const SkillBar = ({ name, proficiency }) => {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold text-slate-200">
          {name}
        </span>
        <span className="text-xs font-bold text-slate-450">
          {proficiency}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-neon-gradient neon-glow rounded-full"
        />
      </div>
    </div>
  );
};
export default SkillBar;
