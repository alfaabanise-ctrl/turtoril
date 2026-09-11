<script setup lang="ts">


</script>

<template>
    <div>
        <NavigationNavbar/>
        <Herosection/>
        <div class="bg-gray-100  mxau t  text-black  8">
            <Container class="  ">
                    <p class=" text-sm  text cetner">More than exam prep — a complete learning experience with rich content, <span class="font-semibold text-[#0794bd]">smart practice</span> , <span class="font-semibold text-[#0794bd]">exam tips</span>, 
                    and  <span class="font-semibold text-[#0794bd]">intelligent guidance </span> to help you learn, improve, and succeed.
                    </p>
            </Container>   
        </div>

        <Container>
            <div class="mx-auto  ">
                <div v-for="(item, index) in benefit" :key="item.id" 
                 class=" bgck  grid grid-cols-1 md:grid-cols-2 items-center   gap-7">
                    <div :class="index % 2 === 0 ? 'md:order-2' : 'md:order-1'"  class=" e rounded-lg  has-full  p-6">
                        <img :src="item.image" alt="item.image" class="sm:w-1/3 w-full h-auto">
                    </div> 
                    <div :class="index % 2 === 0 ? 'md:order-1' : 'md:order-2'" class="bg#  rounded-lg   p-6">
                        <h2 class="text-xl text-[#0794bd] font-bold mb-2">{{ item.title }}</h2>
                        <p class="text-gray-700 text-sm">{{ item.description }}</p>
                    </div>
                   
                </div>
            </div>
        </Container>

        <section class="bg-[url('/images/exam-background.jpg')] bg-cover bg-center bg-fixed py-8">
            <Container>
                <div class=" rounded-lg text-white p-6 text-center" >
                    <h2 class="text-2xl  font-bold mb-4">Upgrade How You Learn</h2>
                    <p class=" y-700 text mb-4">Whether you're preparing for JAMB exams or SSCES tests like NABTEB, WAEC, ExamTips gives you the tools to succeed.</p>
                    <Button class="bg-[#0794bd] text-white px-4 py-2 rounded hover:bg-[#057a9c]">Get Started Free</Button>
                </div>
                
            </Container>
        </section>

         <section class=" bg-cover bg-center bg-fixed py-8">
            <Container>
                <h2  class="text-2xl  font-bold mb-4">Results That Speak</h2>
                <p class="text-gray-700 text-sm mb-4">ExamTips has helped thousands of students achieve their goals. Here are some of their success stories:</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-for="item in reviews" :key="item.id"  class="bg-white rounded-lg shadow p-4">
                        <p class="text-gray-700 text-sm mb-2">"{{ item.text }}"</p>
                        <p class="text-gray-500 text-xs">- {{ item.author }} ({{
                            item.usertype }})</p>
                    </div>
                   
                    
                </div>
            </Container>
        </section>
    
<NavigationFooter/>
    
</div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const benefit = ref([
  {
    id: 1,
    title: 'Practice with Purpose',
    description:
      'Turn every practice session into a step toward exam success. ExamTips gives you access to past and carefully crafted model questions in a realistic exam environment. Focus on specific topics, set your own time limits, and practice under conditions that prepare you for the real exam. Powerful search makes it easy to find questions by keywords, while clear answers and explanations help you understand the why behind every question. Track your performance, discover your strengths, identify areas for improvement, and study smarter with every attempt.',
    image: '/images/cbt.png'
  },

  {
    id: 2,
    title: 'Learn in the Classroom',
    description:
      'Everything you need to learn, all in one place. The Classroom brings together structured study materials, PDF notes, educational videos, and exercises across your subjects, all aligned with the curriculum. Learn at your own pace, complete exercises to reinforce your understanding, and watch your progress grow in real time. With a clear learning path and progress tracking, you always know what you have mastered and what to tackle next.',
    image: '/images/learning-tools.png'
  },

  {
    id: 3,
    title: 'Learn Through Games & Quizzes',
    description:
      'Make learning exciting, interactive, and memorable. Turn questions from our extensive question bank into fun educational games and engaging quizzes. Challenge yourself, test your knowledge, reinforce what you have learned, and improve your skills without the pressure of traditional studying. Every game is an opportunity to learn, grow, and have fun while preparing for success.',
    image: '/images/games.png'
  }
])

const reviews = ref([
  {
    id: 1,
    text: '"ExamTips helped me improve my scores significantly. The practice questions and explanations were invaluable!"',
    author: 'Tolani A.',
    usertype: 'Student'
  },
  {
    id: 2,
    text: '"I was able to identify my weak areas and focus on them, which made a huge difference in my exam performance."',   
    author: 'Jamal Ke.',
    usertype: 'Student'
  },
  {
    id: 3,
    text: '"The Classroom feature allowed me to learn at my own pace and track my progress effectively."',
    author: 'Oyetola C.',
    usertype: 'Student'
  }
])

</script>