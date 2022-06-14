import xlsx from 'node-xlsx';

const EXEL_HEADER = [
    'danger',
    'tempRoom',
    'tempWater', 
    'lightSensor',
    'lightWorkingTime',
    'lightOffTime',
    'pumpTime',
    'pumpSleep',
    'date',
];

const getFormattedDataFromExperimentForExel = (experiment) => {
    const body = experiment.measurements.map(measurement => {
        return EXEL_HEADER.map(key => measurement[key])
    });

    return [
        EXEL_HEADER,
        ...body
    ]
}

const xlsxBuild = (experiment) => {
    const data = getFormattedDataFromExperimentForExel(experiment);

    const sheetOptions = {
        '!cols': Array(data[0].length).fill({ wch: 20 })
    };
    const buffer = xlsx.build(
        [
            {
                name: experiment.title,
                data: data
            }
        ],
        {
            sheetOptions
        }
    );

    return buffer;
};

export default xlsxBuild;