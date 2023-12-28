<template>
  <div>
    <div>
      <!-- Adjust the width and height of the canvas element -->
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  mounted() {
    // Get the canvas element after the component is mounted
    const ctx = this.$el.querySelector('#myChart');

    // Check if the canvas element exists
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    // Create the chart
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // Red
            'rgba(54, 162, 235, 0.2)', // Blue
            'rgba(255, 255, 0, 0.2)',   // Yellow
            'rgba(75, 192, 192, 0.2)',  // Green
            'rgba(128, 0, 128, 0.2)',  // Purple
            'rgba(255, 165, 0, 0.2)',  // Orange
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(128, 0, 128, 1)',
            'rgba(255, 165, 0, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 10 // Adjust the font size of the legend
              }
            }
          }
        },
        // Adjust bar width properties
        indexAxis: 'x', // Horizontal bar chart
        barPercentage: 0.7, // Adjust the width of individual bars
        categoryPercentage: 0.7, // Adjust the width of bar categories
      }
    });
  }
};
</script>

<style scoped>
/* Add any additional styling here */
</style>
