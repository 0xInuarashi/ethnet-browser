///// Import Node Modules /////
import dotenv from              "dotenv";
import { ethers } from          "ethers";

///// Provider /////
// const PROVIDER = new ethers.AlchemyProvider("homestead", process.env.ALCHEMY_KEY);
const PROVIDER = new ethers.AlchemyProvider("homestead", "WD-UJIxgz-_Y6lp1DVRjWd6HQFuI7Kxb");

///// ETHNet /////
const ABI_ETHNET = () => {
    return [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"},{"indexed":true,"internalType":"string","name":"identifier","type":"string"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"string","name":"data","type":"string"}],"name":"Data","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"identifier","type":"string"},{"internalType":"string","name":"data","type":"string"}],"name":"submit","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"}]
};
const ADDRESS_ETHNET = "0xA906669374D4ED40d8dE5614b6c81ADce1c91ab7";
const ETHNET = new ethers.Contract(ADDRESS_ETHNET, ABI_ETHNET(), PROVIDER);

///// TokenURI /////
const filter_ETHNET_Data = (id_, identifier_, address_) => {
    const _filter = ETHNET.filters.Data(
        id_ || null,
        identifier_ || null,
        address_ || null
    );
    return _filter;
};

// ///// Regex /////
const regex_handleAtobJsonB64 = /^data:application\/json;base64,/;
const _hasAtobJsonB64 = (string_) => regex_handleAtobJsonB64.test(string_);
const _trimAtobJsonB64 = (string_) => string_.replace(regex_handleAtobJsonB64, '');

const _convertAtobJsonB64ToJson = (string_) => {
    const _atob = _trimAtobJsonB64(string_);
    const _decodedData = Buffer.from(_atob, 'base64').toString();
    const _json = JSON.parse(_decodedData);
    return _json;
};

///// Export Data /////
const browser_getData = async(id_, identifier_, address_) => {
    try {
        console.log({id_, identifier_, address_});
        const _lookupFilter = filter_ETHNET_Data(id_, identifier_, address_);
        const _eventQuery = await ETHNET.queryFilter(_lookupFilter, 0, "latest");
        // console.log(_eventQuery);
        return _eventQuery;
    }
    catch (e) {
        console.log(e);
        return {};
    };
};

// await browser_getData(null, "ethnet-litepaper", null);

export { 
    browser_getData
};