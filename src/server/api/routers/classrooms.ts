import { createTRPCRouter, protectedProcedure } from "../trpc";

type Classroom = {
    id: number;
    name: string;
};

export const classroomRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {

            const classrooms: Classroom[] = [
                { id: 1, name: "Math" },
                { id: 2, name: "Science" },
                { id: 3, name: "English" },
                { id: 4, name: "History" },
            ];

            return {
                classrooms: classrooms
            };
        })
});
