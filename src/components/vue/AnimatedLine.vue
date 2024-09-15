<template>
    <div>
        <svg :width="width" :height="height" ref="svg">
            <path :d="pathData" :stroke="color" fill="transparent" stroke-width="2" ref="path" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import anime from 'animejs/lib/anime.es.js';

// Define props
const props = defineProps<{
    options: {
        pathData: string;
        width?: number;
        height?: number;
        color?: string;
        delay?: number;
    }
}>();

const width = ref(props.options.width || 500);
const height = ref(props.options.height || 500);
const color = ref(props.options.color || 'black');
const pathData = ref(props.options.pathData);

// Refs for SVG and path elements
const svg = ref<SVGSVGElement | null>(null);
const path = ref<SVGPathElement | null>(null);

const startAnimation = () => {
    console.log('animation start');
    if (path.value) {
        const length = path.value.getTotalLength();
        path.value.style.strokeDasharray = `${length}`;
        path.value.style.strokeDashoffset = `${length}`;

        anime({
            targets: path.value,
            strokeDashoffset: [length, 0],
            easing: 'easeInOutSine',
            duration: 2000,
            direction: 'normal',
            loop: false,
            delay: props.options.delay || 0

        });
    }
};

onMounted(() => {
    startAnimation();
    console.log('mounted');
});
</script>

<style scoped></style>