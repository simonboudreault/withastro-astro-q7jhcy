<template>
    <div class="wrapper">
        <AnimatedLine v-for="(svg, index) in svgs" :key="index" :options="svg.options"
            :style="{ top: svg.options.top + 'px', left: svg.options.left + 'px', position: 'absolute' }" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AnimatedLine from './AnimatedLine.vue';

// Props
interface SvgWrapperProps {
    numOfSvgs: number;
}
type SvgProps = { options: { pathData: string; width?: number; height?: number; color?: string; delay?: number; top: number; left: number; }; };
const props = defineProps<SvgWrapperProps>();

// Define 5 different SVG paths, they should not go outside the box
const svgPaths = [
    'M 10 10 L 90 10 L 90 90 L 10 90 Z',
    'M 10 10 L 90 10 L 50 90 Z',
    'M 10 10 L 90 10 L 50 90 L 10 90 Z',
    'M 10 10 L 90 10 L 90 90 Z',
    'M 10 10 L 90 10 L 50 90 L 10 90 Z',
];

function getRandomPosition(max: number, existingPositions: number[] = []): number {
    // the shapes must not overlap
    const position = Math.floor(Math.random() * max);
    return existingPositions.includes(position) ? getRandomPosition(max, existingPositions) : position;

}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function createSvgPropsObject(wrapperWidth: number, wrapperHeight: number): SvgProps {
    return {
        options: {
            pathData: svgPaths[Math.floor(Math.random() * svgPaths.length)],
            width: 100,
            height: 100,
            color: getRandomColor(),
            delay: Math.random() * 1000,
            top: getRandomPosition(wrapperHeight - 100),
            left: getRandomPosition(wrapperWidth - 100),
        }
    }
}
// Initialize positions with unique values
const svgs = ref<SvgProps[]>([]);

onMounted(() => {
    const wrapper = document.querySelector('.wrapper');
    const wrapperWidth = wrapper ? wrapper.clientWidth : 500;
    const wrapperHeight = wrapper ? wrapper.clientHeight : 500;

    for (let i = 0; i < props.numOfSvgs; i++) {
        svgs.value.push(createSvgPropsObject(wrapperWidth, wrapperHeight));
    }
});
</script>

<style scoped>
.wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    /* Adjust based on your requirement */
    /* overflow: hidden;
    border: 1px solid #ccc; */
}
</style>