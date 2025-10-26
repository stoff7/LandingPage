<template>
    <div class="basement">
        <div class="left-column">
            <p class="copyright"> © TRAVEL AI</p>
        </div>
        <div class="middle-column">
            <a class="email" href="mailto:kostrov.444@yandex.com">kostrov.444@yandex.com</a>
        </div>
        <div class="right-column">
            <a class="TravelAI-tg" href="https://t.me/Travel_AI_group">Travel AI</a>
            <a class="CampPlace-tg" href="https://t.me/Camp_Place">Camp Place</a>
            <a class="TravelAI-bot" href="https://t.me/Fish_Agent_Bot">Travel AI bot</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Basement',
};
</script>
<style lang="scss" scoped>
.basement {
    font-family: $main-font;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    padding: 1.85vh 1.04vw;
    background: $black;
    border-top: 0.09vh solid $beige;
    color: $beige;

    .left-column {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: end;
        gap: 0.93vh;

        a {
            color: $beige;
            text-decoration: none;
            font-size: 1.48vh;
            transition: color 0.3s ease;

            @media (hover: hover) {
                &:hover {
                    color: color.adjust($beige, $lightness: 20%);
                }
            }
        }
    }

    .middle-column {
        display: flex;
        align-items: center;
        justify-content: center;

        a {
            color: $beige;
            text-decoration: none;
            font-size: 1.67vh;
            transition: color 0.3s ease;

            @media (hover: hover) {
                &:hover {
                    color: lighten($beige, 20%);
                }
            }
        }
    }

    .right-column {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: end;
        gap: 0.93vh;

        a {
            color: $beige;
            text-decoration: none;
            font-size: 1.48vh;
            transition: color 0.3s ease;

            @media (hover: hover) {
                &:hover {
                    color: color.adjust($beige, $lightness: 20%);
                }
            }
        }
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        padding: 1.85vh 1.04vw;
        text-align: center;

        .left-column {
            justify-content: center;
            margin-bottom: 1.85vh;
        }

        .middle-column {
            margin-bottom: 1.85vh;
        }

        .right-column {
            flex-direction: row;
            justify-content: center;
            gap: 1.04vw;
        }
    }
}
</style>