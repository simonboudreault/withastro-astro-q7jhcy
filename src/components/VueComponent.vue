<template>
    <div class="panel">
        <h1>{{ currentSectionIndex }}</h1>
        <button @click="logg">logg</button>
    </div>
</template>

<script setup lang="ts">
import anime from 'animejs';
import { ref, onMounted } from 'vue'
const currentSectionIndex = ref(0)
const message = ref('Hello Vue 3!')
const isScrolling = ref(false)
const sections = document.querySelectorAll('.section');
const innerSections = Array(...sections)
const animationDuration = 600; // Duration in milliseconds
const easingFunction = 'cubicBezier(.4,0,0,1)'; // Anime.js easing function
const sectionHeightIn = 80; // Height of each section in vh
const sectionWidthIn = 80; // Width of each section in vw
const sectionHeightOut = 20; // Height of each section in vh
const sectionWidthOut = 20; // Width of each section in vw
const zIn = 0;
const zDisplacement = 50;
const verticalDisplacement = 100



// function to map the rotation of the sections on the relative x value of the mouse on mouse move
const scale = 15;



function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling.value = true;
    anime({
        targets: sections,

        translateY: (el, i) => {
            if (i < index) return -1 * verticalDisplacement + 'vh';
            if (i === index) return '0';
            return verticalDisplacement + 'vh';
        },
        translateZ: (el, i) => {
            if (i < index) return -zDisplacement * (index - i) + 'px';
            if (i === index) return '0' + 'px';
            return zDisplacement * (i - index) + 'px';
        },
        scale: (el, i) => {
            if (i < index) return sectionWidthOut / sectionWidthIn;
            if (i === index) return '1';
            return sectionWidthOut / sectionWidthIn;
        },
        // rotateX: 5,
        // rotateY: 5,
        // rotateZ: 5,
        // translateZ: -10,

        // rotateY: (el, i) => {
        //   if (i < index) return '-90deg';
        //   if (i === index) return '0';
        //   return '90deg';
        // },
        // rotateX: (el, i) => {
        //   if (i < index) return '45deg';
        //   if (i === index) return '0';
        //   return '-45deg';
        // },
        duration: animationDuration,
        easing: easingFunction,
        complete: () => {
            isScrolling.value = false;
        },
    });

    currentSectionIndex.value = index;
}
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
function handleMouseMove(event) {
    const x = event.clientX;
    const y = event.clientY;
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const rotateY = mapRange(x, 0, window.innerWidth, -scale, scale);
    const rotateX = mapRange(y, 0, window.innerHeight, scale, -scale);
    anime({
        targets: sections,
        rotateY: rotateY,
        rotateX: rotateX,
        duration: 100,
        easing: 'easeOutQuad',
    });
}
function handleScroll(event) {
    console.log('handle scroll (wheel event) scroll ' + isScrolling.value + ' ' + event.deltaY)

    if (isScrolling.value) return;

    event.preventDefault();
    if (event.deltaY > 0) {
        scrollToSection(currentSectionIndex.value + 1);
    } else {
        scrollToSection(currentSectionIndex.value - 1);
    }




}
onMounted(() => {
    // document.addEventListener('DOMContentLoaded', callback)
    console.log('mounted')
    console.log(innerSections)
    // document.addEventListener('mousemove', handleMouseMove);

    document.addEventListener('wheel', handleScroll, { passive: false })
    document.addEventListener('scroll', e => {
        console.log('scroll')
        e.preventDefault()
    })
    document.addEventListener('DOMContentLoaded', () => { })

});

const logg = () => {
    console.log('logg')
}

</script>

<style scoped>
h1 {
    color: rgb(255, 255, 255);
}

.panel {
    position: absolute;
    z-index: 9999;
}
</style>