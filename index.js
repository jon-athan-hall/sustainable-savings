const form = document.getElementById('form');
const ctx = document.getElementById('canvas');

function buildLabels(labelCount) {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const monthNumber = today.getMonth();
  const yearNumber = today.getFullYear() % 100;
  let labels = [];

  for (let i = 0; i < labelCount; i++) {
    const monthRemainder = (monthNumber + i) % 12;
    const monthQuotient = Math.floor((monthNumber + i) / 12);
    labels.push(MONTHS[monthRemainder] + ' \'' + (yearNumber + monthQuotient).toString());
  }

  return labels;
}

function buildData(startValue, timeIncrement, valueCount) {
  let data = [];

  for (let i = 0; i < valueCount; i++) {
    data.push((i * startValue / timeIncrement) + startValue);
  }

  return data;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const usualPrice = parseFloat(form.querySelector('input[name="usual-price"]').value);
  const usualTime = parseInt(form.querySelector('input[name="usual-time"]').value);
  const shiftPrice = parseFloat(form.querySelector('input[name="shift-price"]').value);

  const intersectionX = Math.ceil((usualTime * (shiftPrice - usualPrice)) / usualPrice);
  const intersectionY = shiftPrice;

  const labelCountX = Math.floor(intersectionX * 10 / 6);
  const labelCountY = Math.floor(intersectionY * 10 / 6);

  const labels = buildLabels(labelCountX);
  const usualData = buildData(usualPrice, usualTime, labelCountX);
  const shiftData = Array(labelCountX).fill(shiftPrice);

  const data = {
    labels: labels,
    datasets: [
      {
        data: shiftData,
        borderColor: '#678884'
      },
      {
        data: usualData,
        borderColor: '#666666'
      }
    ]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.raw.toFixed(2);
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            lineWidth: 2
          },
          ticks: {
            color: 'black',
            font: {
              weight: 'bold'
            }
          }
        },
        y: {
          grid: {
            lineWidth: 2
          },
          ticks: {
            callback: function(val, index) {
              return '$' + val;
            },
            color: 'black',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    }
  };

  new Chart(ctx, config);
});
