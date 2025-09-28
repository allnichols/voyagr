// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import React from "react";

// export const DayActivitiesDropdown = React.memo(
//     function DayActivitiesDropdown({ dayNumber }: { dayNumber: number }) {
//         const queryClient = useQueryClient();
//         const { data: activities } = useQuery({ 
//             queryKey: ['dayActivities', dayNumber],
//             queryFn: () => console.log('fetch day activities')
//         });

//         const addActivityMutation = useMutation({
//             mutationFn: (newActivity: any) => console.log('add activity', newActivity),
//             onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dayActivities', dayNumber]})
//         })

//         if(!activities) return <div>Loading...</div>;
        
//         return <></>
//     });