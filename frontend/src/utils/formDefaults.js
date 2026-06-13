export const initialFormState = {
  name: '',
  date: new Date().toISOString().split('T')[0],
  cookingTime: '60',
  numberOfPeople: '2',
  breakfastPreference: '',
  lunchPreference: '',
  dinnerPreference: '',
  dietaryRestrictions: '',
  allergies: '',
  dietType: 'non-vegetarian',
  cuisinePreference: '',
  availableIngredients: '',
  budget: '500',
  skillLevel: 'intermediate',
  appliances: '',
  nutritionGoal: '',
  currency: 'INR',
};

export const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const dietTypes = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'non-vegetarian', label: 'Non-Vegetarian' },
];

export const cookingTimeOptions = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2+ hours' },
];
