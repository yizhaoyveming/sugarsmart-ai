import React from 'react';
import { Heart, ChevronRight, Edit2, Trash2 } from 'lucide-react';

export interface Recipe {
  id: string;
  name: string;
  mealType: string;
  time: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    giLevel: 'Low' | 'Medium' | 'High';
  };
  tips: string;
  imageUrl?: string; // AI生成的图片URL
}

export interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
  onEdit?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onViewDetail?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onDelete, 
  onEdit,
  isSaved = false,
  onToggleSave,
  onViewDetail
}) => {
  // 优先使用AI生成的图片，否则使用占位图
  const imageUrl = recipe.imageUrl || (() => {
    const seed = recipe.mealType + recipe.name.length;
    return `https://picsum.photos/seed/${seed}/400/250`;
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative">
      <div className="flex">
        {/* Left Side: Image */}
        <div className="w-1/3 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <span className="text-white text-xs font-bold">
              {recipe.nutrition.calories > 0 ? `${recipe.nutrition.calories} 千卡` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start pr-6">
              <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                {recipe.name}
              </h3>
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                recipe.nutrition.giLevel === 'Low' ? 'bg-green-100 text-green-700' :
                recipe.nutrition.giLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {recipe.nutrition.giLevel === 'Low' ? '低' : 
                 recipe.nutrition.giLevel === 'Medium' ? '中' : '高'} GI
              </span>
              {recipe.nutrition.carbs > 0 && (
                <span className="text-[10px] text-gray-500">
                  {recipe.nutrition.carbs}克 碳水
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            {onToggleSave && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleSave(); 
                }} 
                className="text-gray-400 hover:text-red-500"
              >
                <Heart 
                  size={16} 
                  className={isSaved ? "fill-red-500 text-red-500" : ""} 
                />
              </button>
            )}

            {onViewDetail && (
              <button 
                onClick={onViewDetail}
                className="text-brand-green text-xs font-semibold flex items-center hover:underline bg-brand-light px-2 py-1 rounded-full"
              >
                查看 <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons - Top Right */}
      <div className="absolute top-2 right-2 flex space-x-1">
        {onEdit && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onEdit(); 
            }}
            className="p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-brand-green hover:bg-green-50 transition-colors shadow-sm"
          >
            <Edit2 size={12} />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(); 
            }}
            className="p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
