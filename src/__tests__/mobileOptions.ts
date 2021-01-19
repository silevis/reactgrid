const USERNAME = process.env.USERNAME;
const AUTOMATE_KEY = process.env.AUTOMATE_KEY;
export const browserstackURL = `https://${USERNAME}:${AUTOMATE_KEY}@hub-cloud.browserstack.com/wd/hub`;

export const localServerOptions = {
    'key': process.env.BROWSERSTACK_ACCESS_KEY,
};

export const browserstackCapabilities = {
    "os_version": "10.0",
    "device": "Samsung Galaxy S20 Ultra",
    "real_mobile": "true",
    "browserstack.appium_version": "1.19.1",
    "browserstack.local": "false",
    "browserstack.user": USERNAME,
    "browserstack.key": AUTOMATE_KEY,
    "browserName": "Chrome"
}

export const IpadCapabilities = {
    'device': 'iPad Pro 11 2020',
    'realMobile': 'true',
    'os_version': '13',
    'browserName': 'iPhone',
    'name': 'iOS Test',
    'browserstack.local': true,
    'browserstack.user': USERNAME,
    'browserstack.key': AUTOMATE_KEY,
}

export const appiumURL = 'http://0.0.0.0:4723/wd/hub';
export const mobileLocalcapabilities = {
    "browserName": 'Chrome',
    "deviceName": process.env.DEFAULT_ANDROID_DEVICE_NAME,
    "platformName": 'Android',
    "noSign": true,
}
