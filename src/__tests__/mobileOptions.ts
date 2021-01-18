const USERNAME = "xxx";
const AUTOMATE_KEY = "xxx";
const browserstackURL = `https://${USERNAME}:${AUTOMATE_KEY}@hub-cloud.browserstack.com/wd/hub`;
const browserstackCapabilities = {
    "os_version": "10.0",
    "device": "Samsung Galaxy S20 Ultra",
    "real_mobile": "true",
    "browserstack.appium_version": "1.19.1",
    "browserstack.local": "false",
    "browserstack.user": USERNAME,
    "browserstack.key": AUTOMATE_KEY,
    "browserName": "Chrome"
}

export const appiumURL = 'http://0.0.0.0:4723/wd/hub';
export const mobileLocalcapabilities = {
    "browserName": 'Chrome',
    /**
     * Default device. If unavailable, then Appium select first available device
     */
    "deviceName": 'bb0f6f97',
    "platformName": 'Android',
    "noSign": true,
}
