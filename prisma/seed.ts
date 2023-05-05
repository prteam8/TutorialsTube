import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";


const client = new PrismaClient();

const getSubjects = (): Prisma.subjectsCreateInput[] => [
    {
        sub_code: "20CS21P",

        sub_name: "Operating systems"
    },
    {
        sub_code: "20CS22P",

        sub_name: "Multimedia and animation"
    },
    {
        sub_code: "20CS23P",

        sub_name: "Software engineering"
    },
    {
        sub_code: "20CS24P",

        sub_name: "Hardware"
    },
    {
        sub_code: "20CS25P",
        sub_name: "Kannada"
    }
]
const getDepartment = (): Prisma.departmentsCreateManyInput[] => [
    {
        department_name: "CSE"
    },
    {

        department_name: "EC"
    },
    {

        department_name: "ME"
    },
    {

        department_name: "CE"
    },
    {

        department_name: "AE"
    },
]
const getStudents = (d_name: string): Prisma.studentsCreateManyInput[] => [

    {
        d_name,
        email: faker.internet.email(),
        full_name: faker.name.fullName(),
        interests: faker.lorem.paragraph(),
        password: faker.internet.password(),
        user_name: faker.internet.userName()
    },
    {
        d_name,
        email: faker.internet.email(),
        full_name: faker.name.fullName(),
        interests: faker.lorem.paragraph(),
        password: faker.internet.password(),
        user_name: faker.internet.userName()
    },


]
const getStaff = (d_name: string): Prisma.staffsCreateManyInput[] => [

    {
        d_name,
        subjects_undertaken: faker.lorem.words(),
        email: faker.internet.email(),
        full_name: faker.name.fullName(),
        password: faker.internet.password(),
        user_name: faker.internet.userName()
    },
    {
        d_name,
        subjects_undertaken: faker.lorem.words(),
        email: faker.internet.email(),
        full_name: faker.name.fullName(),
        password: faker.internet.password(),
        user_name: faker.internet.userName()
    }
]





const main = async () => {
    await client.watchlist.deleteMany();
    await client.staff_uploads.deleteMany();
    await client.student_answers.deleteMany();
    await client.staff_answers.deleteMany();
    await client.questions.deleteMany();
    await client.review_replies.deleteMany();
    await client.review.deleteMany();
    await client.course.deleteMany();
    await client.subjects.deleteMany();
    await client.students.deleteMany();
    await client.staffs.deleteMany();
    await client.departments.deleteMany();


    await client.subjects.createMany({
        data: getSubjects()
    });
    await client.departments.createMany({
        data: getDepartment()
    });
    const departments = await client.departments.findMany();

    await Promise.all(
        departments.map(async (department) => {
            await client.students.createMany({
                data: getStudents(department?.department_name!)
            })
        }));
    await Promise.all(
        departments.map(async (department) => {
            await client.staffs.createMany({
                data: getStaff(department?.department_name!)
            })
        }));
    const subject = await client.subjects.findMany();
    const staff = await client.staffs.findMany();
    const department = await client.departments.findFirst();



    await Promise.all(
        staff.map(async (staffs) => {
            const randomIndex = Math.floor(Math.random() * subject.length);
            await client.course.createMany({
                data: [
                    {
                        d_name: department?.department_name!,
                        sub_id: subject[randomIndex]?.id!,
                        st_id: staffs?.id!,
                        dislikes: faker.datatype.number(),
                        likes: faker.datatype.number(),
                        title: faker.lorem.sentence()

                    },
                ]
            })
        }))
    const students_list = await client.students.findMany();
    const courses_list = await client.course.findMany();


    await Promise.all(
        courses_list.map(async (courses) => {
            const randomIndex = Math.floor(Math.random() * students_list.length);

            await client.review.createMany(
                {
                    data: [
                        {
                            courseId: courses.id!,
                            dislikes: faker.datatype.number(),
                            likes: faker.datatype.number(),
                            review_content: faker.lorem.sentence(),
                            s_id: students_list[randomIndex].id!

                        },
                        {
                            courseId: courses.id!,
                            dislikes: faker.datatype.number(),
                            likes: faker.datatype.number(),
                            review_content: faker.lorem.sentence(),
                            s_id: students_list[randomIndex].id!

                        },
                    ]
                })
        }))

    const reviews_list = await client.review.findMany();
    await Promise.all(
        reviews_list.map(async (review) => {
            const randomIndex = Math.floor(Math.random() * students_list.length);

            await client.review_replies.createMany(
                {
                    data: [
                        {
                            r_id: review.id!,
                            dislikes: faker.datatype.number(),
                            likes: faker.datatype.number(),
                            reply_content: faker.lorem.sentence(),
                            s_id: students_list[randomIndex].id!

                        },


                    ]
                })
        }))

    await Promise.all(
        courses_list.map(async (course) => {
            const randomIndex = Math.floor(Math.random() * students_list.length);

            await client.questions.createMany(
                {
                    data: [
                        {
                            c_id: course.id!,
                            content: faker.lorem.sentence(),

                            s_id: students_list[randomIndex].id!

                        },
                        {
                            c_id: course.id!,
                            content: faker.lorem.sentence(),

                            s_id: students_list[randomIndex].id!

                        },


                    ]
                })
        }))

    const questions_list = await client.questions.findMany();
    await Promise.all(
        questions_list.map(async (questions) => {
            const randomIndex = Math.floor(Math.random() * students_list.length);

            await client.student_answers.createMany(
                {
                    data: [
                        {
                            q_id: questions?.id!,
                            content: faker.lorem.sentence(),

                            s_id: students_list[randomIndex].id!
                        },
                        {
                            q_id: questions?.id!,
                            content: faker.lorem.sentence(),

                            s_id: students_list[randomIndex].id!

                        },



                    ]
                })
        }))
        await Promise.all(
            questions_list.map(async (questions) => {
                const randomIndex = Math.floor(Math.random() * staff.length);
    
                await client.staff_answers.createMany(
                    {
                        data: [
                            {
                                q_id:questions?.id!,
                                content:faker.lorem.sentence(),
                              
                                st_id: staff[randomIndex].id!
                            },
                            {
                                q_id:questions?.id!,
                                content:faker.lorem.sentence(),
                              
                                st_id: staff[randomIndex].id!
    
                            },
                            
                            
                           
                        ]
                    })
            }))
            await Promise.all(
                students_list.map(async (students) => {
                    const randomIndex = Math.floor(Math.random() * courses_list.length);
                    await client.watchlist.createMany({
                        data: [
                            {
                              c_id:courses_list[randomIndex]?.id!,
                              s_id: students.id!,

                            },
                            {
                                c_id:courses_list[randomIndex]?.id!,
                                s_id: students.id!,
  
                              },
                        ]
                    })
                }))
                await Promise.all(
                    staff.map(async (staffs) => {
                        const randomIndex = Math.floor(Math.random() * courses_list.length);
                        await client.staff_uploads.createMany({
                            data: [
                                {
                                  c_id:courses_list[randomIndex]?.id!,
                                  st_id: staffs?.id!,
    
                                },
                                {
                                    c_id:courses_list[randomIndex]?.id!,
                                    st_id: staffs?.id!,
      
                                  },
                            ]
                        })
                    }))















}
main()
    .then(() => {
        console.log("Successfully Seeded");
    })
    .catch((e) => {
        console.log(e);
    });