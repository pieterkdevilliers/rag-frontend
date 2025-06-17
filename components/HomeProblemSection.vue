<template>
	<div class="problem-section container mx-auto px-4 py-8">
		<h2 class="text-3xl text-center mb-8">
			Are Your Website Visitors Getting Frustrated? Are You Losing Time?
		</h2>

		<div class="flex flex-wrap justify-center gap-6">
			<!--
        flex:       Makes this a flex container.
        flex-wrap:  Allows items to wrap to the next line on smaller screens.
        justify-center: Centers the items in the line if there's extra space.
        gap-6:      Adds space between the boxes.
      -->
			<div
				v-for="(problem, index) in problems"
				:key="index"
				class="problem-box bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-6 shadow-md w-full sm:w-auto sm:min-w-[280px] sm:max-w-xs md:flex-1 md:max-w-none"
			>
				<!--
          problem-box styling:
          - bg-white dark:bg-gray-800: Background color with dark mode support.
          - border border-gray-300 dark:border-gray-600: The "box outline".
          - rounded-lg: Rounded corners.
          - p-6: Padding inside the box.
          - shadow-md: A subtle shadow for depth.

          Sizing (responsive):
          - w-full: Full width on extra-small screens (stacked).
          - sm:w-auto: Auto width on small screens and up, allowing content to define width up to a point.
          - sm:min-w-[280px]: Ensures a minimum width on small screens so they don't get too squished.
          - sm:max-w-xs: Limits width on small screens.
          - md:flex-1: On medium screens and up, allow boxes to grow and share space equally.
          - md:max-w-none: Remove max-width constraint on medium screens if flex-1 is used, or set a new one.
                           Alternatively, you could use something like md:w-1/2 lg:w-1/4 if you want a fixed number of columns.
                           Given 4 items, `md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]` could also work if `gap-6` (1.5rem) is used,
                           adjusting for the gap. `flex-1` is simpler if equal distribution is fine.
        -->
				<p
					class="text-gray-700 dark:text-gray-300 text-center sm:text-left"
				>
					{{ problem }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const problems = ref<string[]>([
	"Visitors can't find answers on your site and leave frustrated?",
	'Spending too much time answering the same customer questions over and over?',
	"Losing potential sales because prospects can't get immediate information when they need it?",
	'Want to provide 24/7 support without hiring more staff?',
]);
</script>

<style scoped>
/* You can add component-specific styles here if needed,
   but Tailwind is handling most of it. */

.problem-section {
	/* Example of a specific style if needed */
}

.problem-box {
	/*
    Using md:flex-1 means on medium screens and up, if there are, for example,
    3 items in a row, they will each take 1/3 of the available space.
    If you had 4 items, they'd each take 1/4.
    This makes them distribute evenly.
  */
	/* transition: transform 0.2s ease-in-out; */ /* Optional: for a little hover effect */
}

/* .problem-box:hover { */
/* transform: translateY(-4px); */ /* Optional: slight lift on hover */
/* } */
</style>
