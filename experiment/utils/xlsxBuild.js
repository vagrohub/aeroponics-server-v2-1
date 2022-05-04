import xlsx from 'node-xlsx';

const getFormattedDataFromExperimentForExel = (experiment) => {
    const header = Object.keys(experiment.measurements[0]);
    const body = experiment.measurements.map(measurement => {
        return header.map(key => measurement[key])
    });

    return [
        header,
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