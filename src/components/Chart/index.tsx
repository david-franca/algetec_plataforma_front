import { ApexOptions } from 'apexcharts';
import ptBr from 'apexcharts/dist/locales/pt-br.json';
import { ComponentProps, useMemo } from 'react';
import ApexChart from 'react-apexcharts';

type ApexChartProps = ComponentProps<typeof ApexChart>;

type ChartProps = {
  series: ApexChartProps['series'];
  categories: string[];
  text: string;
  dashArray?: number[];
};

export function LineChart({ categories, series, text, dashArray }: ChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: 'basic-line',
        locales: [ptBr],
        defaultLocale: 'pt-br',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        dashArray,
      },
      xaxis: {
        categories,
      },
      yaxis: {
        title: {
          text,
        },
      },
    }),
    [categories, text, dashArray],
  );

  return <ApexChart options={chartOptions} series={series} type="line" width="250%" />;
}

LineChart.defaultProps = {
  dashArray: undefined,
};

export function RadialChart() {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: 'radialBar',
        locales: [ptBr],
        defaultLocale: 'pt-br',
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      labels: ['Roteirização', 'Desenvolvimento', 'Testes', 'UALAB', 'Modelagem'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 160,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        formatter(seriesName, opts) {
          return `${seriesName}:  ${opts.w.globals.series[opts.seriesIndex]}`;
        },
      },
    }),
    [],
  );
  return <ApexChart options={chartOptions} series={[99, 48, 69, 15, 35]} type="radialBar" width="250%" />;
}
