const axios = require('axios');
const moment = require('moment');
const prompt = require('prompt-sync')();
const columnify = require('columnify');
const BASE_URL = 'https://data.sfgov.org/resource/jjew-r69b.json';
axios.defaults.headers.common['X-App-Token'] = 'pOTicTKRtxgamxNZ5InQ7HyiJ';

const getFoodTrucks = async ({ dayorder, page, currentTime }) => {
    try {
        const result = await axios.get(BASE_URL, {
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
            console.log(`Error Message: ${e.message}`);
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
};

const promptUser = () => {
    const response = prompt('Do you want to continue receiving list of food trucks?(Y/N)');
    return response.toLowerCase() === 'y' ? true : false;
};
const displayData = data => console.log(columnify(data));


const main = async () => {
    let isContinuing = true;
    let currentPage = 1;
    // Get current time and dayorder
    const { dayorder, currentTime } = getCurrentTime();
    do {
        // Get FoodTrucks from API
        const foodTrucks = await getFoodTrucks({ dayorder, currentTime, page: currentPage++ });
        
        // Modify Existing object to display titles with name and address format
        const modifiedFoodTrucks = foodTrucks.map(value => ({ name: value.applicant, address: value.location }));
        if (modifiedFoodTrucks.length === 0) {
            console.log('No more results!!');
            break;
        }

        displayData(modifiedFoodTrucks);
        promptUser();
    } while (isContinuing)
};

main();