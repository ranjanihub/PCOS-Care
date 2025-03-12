import React from 'react';
import { motion } from 'framer-motion';

interface ExerciseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  intensity: 'Low' | 'Moderate' | 'High';
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  description,
  imageUrl,
  duration,
  intensity
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{duration}</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            intensity === 'Low' ? 'bg-green-100 text-green-700' :
            intensity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {intensity} Intensity
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseCard;