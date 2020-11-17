const axios = require('axios');
const moment = require('moment');
const prompt = require('prompt-sync')();
const columnify = require('columnify');
axios.defaults.headers.common['X-App-Token'] = 'pOTicTKRtxgamxNZ5InQ7HyiJ';

const getFoodTrucks = async ({ dayorder, page, currentTime }) => {
    try {
        const result = await axios.get(`https://data.sfgov.org/resource/jjew-r69b.json`, {
            params: {
                $select: 'applicant,location',
                $where: `start24 <= '${currentTime}' AND end24 >='${currentTime}' AND dayorder = ${dayorder}`,
                $order: 'applicant',
                $offset: (page - 1) * 10,
                $limit: 10
            }
        });
        if (result && result.data) {
            return result.data;
        }
        return [];
    } catch (e) {
        if (e.response) {
            console.log(`API failed with exception: ${e.response.status}`);
            console.log(`Error Message: ${e.response.data.message}`);
            process.exit();
        }
        console.log(`Unknown Exception!`);
        process.exit();
    }
};

const getCurrentTime = () => {
    const date = moment.utc().local();
    return {
        dayorder: date.format('d'),
        currentTime: date.format('HH:mm')
    }
}


const main = async () => {
    let isContinuing = true;
    let currentPage = 1;
    const { dayorder, currentTime } = getCurrentTime();
    do {
        const data = await getFoodTrucks({ dayorder, currentTime, page: currentPage });
        
        const convertedData = data.map(value => ({ name: value.applicant, address: value.location }));
        if (convertedData.length === 0) {
            console.log('No more results!!');
            break;
        }
        console.log(columnify(convertedData));
        const response = prompt('Do you want to continue receiving list of food trucks?(Y/N)');
        isContinuing = response.toLowerCase() === 'y' ? true : false;
        currentPage++;
    } while (isContinuing)
};

main();