import { Capabilities } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export function getOptions(): Options {
    const options = new Options();
    options.addArguments('--window-size=1600,900');
    options.addArguments('--disable-web-security');
    options.addArguments('--start-maximized');
    options.addArguments('--allow-insecure-localhost');
    // options.addArguments('--headless');
    // options.addArguments('--auto-open-devtools-for-tabs');

    /*     options.setMobileEmulation({
            deviceName: 'Pixel 2',
            deviceMetrics: {
                width: 1125,
                height: 436,
                pixelRatio: 3.0,
                touch: true,
            },
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
        }) */

    options.setUserPreferences({
        'profile.content_settings.exceptions.clipboard': {
            'http://localhost:3001,*': {
                'last_modified': Date.now(),
                'setting': 1
            },
            'http://localhost:3000,*': {
                'last_modified': Date.now(),
                'setting': 1
            },
        }
    });
    return options;
}

export function getChromeCapabilities(): Capabilities {

    const chromeCapabilities = Capabilities.chrome();
    const chromeOptions = {
        acceptSslCerts: true,
        acceptInsecureCerts: true,
        excludeSwitches: ['--enable-automation'],
        ignoreDefaultArgs: ["--enable-automation"],
        useAutomationExtension: true,
    };

    chromeCapabilities.set('chromeOptions', chromeOptions);
    chromeCapabilities.set('browserName', 'chrome');

    return chromeCapabilities;
}

export function getSafariCapabilities(): Capabilities {
    const capabilities = Capabilities.safari();
    capabilities.set('browserName', 'safari');
    return capabilities;
}
