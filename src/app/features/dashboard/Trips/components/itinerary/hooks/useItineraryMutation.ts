import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ReorderDayData {
    tripId: number;
    dayId: number;
    newPosition: number;
};

export const useReorderDay = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ReorderDayData) => {
      const response = await fetch('http://localhost:3000/api/trip-days/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to reorder day');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripDays', variables.tripId] });
    },
  });
};