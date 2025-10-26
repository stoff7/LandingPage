<template>
    <div class="FAQ-page" ref="faqPageRef">
        <h1 ref="headerRef">Ответы на вопросы</h1>
        <Faqbox ref="faqBox1Ref" :question="faqs[0].question" :answer="faqs[0].answer" :staggerDelay="400" />
        <Faqbox ref="faqBox2Ref" :question="faqs[1].question" :answer="faqs[1].answer" :staggerDelay="600" />
        <Faqbox ref="faqBox3Ref" :question="faqs[2].question" :answer="faqs[2].answer" :staggerDelay="800" />
        <Faqbox ref="faqBox4Ref" :question="faqs[3].question" :answer="faqs[3].answer" :staggerDelay="1000" />

    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import Faqbox from '@/components/Faqbox.vue';

export default {
    name: 'FAQ',
    components: {
        Faqbox,
    },
    setup() {
        const faqPageRef = ref(null);
        const headerRef = ref(null);
        const faqBox1Ref = ref(null);
        const faqBox2Ref = ref(null);
        const faqBox3Ref = ref(null);
        const faqBox4Ref = ref(null);

        const faqs = ref([
            {
                question: 'Учитывает ли сервис рыбалку и другие виды активного отдыха?',
                answer: 'Да! Просто опишите в запросе, чем хотите заняться: спокойный отдых у воды, рыбалка на судака или всё вместе. Искусственный интеллект автоматически учтёт ваши предпочтения в рекомендациях. В будущем мы добавим поддержку других видов туризма.'
            },
            {
                question: 'Как определяется загруженность мест?',
                answer: 'Загруженность отслеживается через выбор дат и локаций пользователями в боте. Чем больше людей пользуется сервисом, тем точнее аналитика. Также вы можете указать в запросе желаемую атмосферу (тихий отдых или шумная компания) — это поможет избежать конфликтов и подобрать подходящее место.'
            },
            {
                question: 'Как формируются рекомендации?',
                answer: 'Искусственный интеллект анализирует ваш запрос, выделяет ключевые предпочтения и тип отдыха. Затем система сравнивает все доступные локации с отзывами из канала CampPlace и других источников, чтобы найти места, максимально соответствующие вашим пожеланиям.'
            },
            {
                question: 'Сервис бесплатный?',
                answer: 'Да, полностью бесплатный. Для покрытия расходов на нейросети и серверы мы размещаем рекламу. Если вам понравится сервис, рекомендуйте его друзьям — это поможет нам продолжать работу!'
            },
        ]);

        onMounted(() => {
            // Создаем observer для анимаций
            const createObserver = (element, delay) => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.classList.add('animated');
                                }, delay);
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.3 }
                );

                if (element) {
                    observer.observe(element);
                }
            };

            // Анимация страницы
            createObserver(faqPageRef.value, 300);
            // Анимация заголовка
            createObserver(headerRef.value, 500);

            // Анимация Faqbox теперь в самом компоненте с threshold и staggerDelay
        });

        return {
            faqPageRef,
            headerRef,
            faqBox1Ref,
            faqBox2Ref,
            faqBox3Ref,
            faqBox4Ref,
            faqs
        };
    }
}
</script>

<style lang="scss" scoped>
.FAQ-page {
    margin-top: 40vh;
    width: 100%;
    height: 100%;

    opacity: 0;
    transform: translateY(-2.78vh);
    transition: all 0.6s ease;

    &.animated {
        opacity: 1;
        transform: translateY(0);
    }

    h1 {
        color: $beige;
        text-align: center;
        font-family: "Oswald";
        font-weight: 300;
        font-size: calc(3.5vw + 3.5vh);
        letter-spacing: 0.2em;

        opacity: 0;
        transform: translateY(-2.78vh);
        transition: all 0.6s ease;

        &.animated {
            opacity: 1;
            transform: translateY(0);
        }
    }

}
</style>