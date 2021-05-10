require('dotenv').config();
import Stripe from 'stripe';

const stripeRadarItems = process.env.STRIPE_RADAR_ITEMS
console.log("🚀 ~ file: index.js ~ line 5 ~ stripeRadarItems", stripeRadarItems);
const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log("🚀 ~ file: index.js ~ line 5 ~ stripeKey", stripeKey);

const stripe = require('stripe')(stripeKey);

const RadarValueListItemKeys = {
    emailBlockListKey: 'email_block_list_id',
    ipBlockListKey: 'ip_block_list_id',
};

const getValuesListItemIds = async (listId) => {
    const resultList = [];
    try {

        /*  eslint-disable-next-line no-restricted-syntax */
        for await (const valueListItem of stripe.radar.valueListItems.list({
            value_list: listId,
            limit: 100,
        })) {
            resultList.push({ value: valueListItem.value, id: valueListItem.id });
        }
        return resultList;
    } catch (err) {
        console.error(
            `Failed to Fetch the radar list for id ${listId} due to stripe error: ${err.message}. \n Returning empty list`
        );
        return resultList;
    }
}


const deleteValueListItem = async (item) => {
    try {
        const stripe = require('stripe')(stripeKey);
        const deleted = await stripe.radar.valueListItems.del(
            item.id
        );
        console.log(`deleted Item id-->value ${item.id}-->${item.value}`)
    } catch (err) {
        console.error(
            `Failed to delete radar list items for id: value ${item.id} --> ${item.value} due to stripe error: ${err.message}. \n Returning empty list`
        );
    }

}


const main = async () => {
    const radarItemsIds = JSON.parse(process.env.STRIPE_RADAR_ITEMS);
    console.log("🚀 ~ file: index.js ~ line 59 ~ main ~ radarItemsIds",)
    const fetchList = Object.values(radarItemsIds).map(eachItem => getValuesListItemIds(eachItem))
    const fullList = await Promise.all(fetchList);
    console.log("🚀 ~ file: index.js ~ line 62 ~ main ~ fullList", fullList.length);
    const deleteList = fullList.map(eachItemList => eachItemList.map(item => deleteValueListItem(item)));
    await Promise.all(deleteList);
}

main();






