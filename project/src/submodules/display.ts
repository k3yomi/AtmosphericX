/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V /
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |
                                     |_|
    Written by: KiyoWx (k3yomi) & StarflightWx
    Last Updated: 2025-10-20
    Changelogs: 
        - Added type definitions for better clarity and maintainability.
        - Implemented a terminal-based display using Blessed for real-time monitoring.
        - Created dynamic elements for logs, system info, sessions, and active events.
        - Established periodic updates to refresh displayed information.
        - Integrated keybindings for graceful exit and interaction.
*/

import * as loader from '../bootstrap';
import * as types from '../types';

export class Display {
    NAME_SPACE = `submodule:display`;
    manager: any;
    package: typeof loader.packages.gui;
    private elements: any = {};
    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        if (!loader.submodules.utils.isFancyDisplay()) { return }
        this.package = loader.packages.gui;
        this.manager = this.package.screen({ 
            smartCSR: true,
            title: `AtmosphericX v${loader.submodules.utils.version()}`,
        })
        await this.intro(1_000)
        this.create();
        this.keybindings();
        this.update();
        setInterval(() => { this.update(); }, 1_000);
    }
    
    private intro(delay: number): Promise<void> {
        return new Promise(async (resolve) => {
            const tempLogo = this.package.box({
                width: 'shrink', height: 'shrink',
                top: 'center', left: 'center',
                content: loader.submodules.utils.logo(),
                tags: true,
                style: { align: 'center', fg: 'white' },
                valign: 'middle', align: 'center'
            })
            const tempConsole = this.package.box({
                top: '65%', left: 'center',
                width: '80%', height: '15%',
                label: ` Preparing AtmosphericX v${loader.submodules.utils.version()} `,
                tags: true, wrap: true,
                content: loader.cache.internal.logs.__console__.map(log => {return `${log.title} [${log.timestamp}] ${log.message}`}).join('\n'),
                border: { type: 'line' },
                scrollable: true, alwaysScroll: true,
                style: { border: { fg: 'white' } }
            })
            this.manager.append(tempLogo);
            this.manager.append(tempConsole);
            this.manager.render();
            await loader.submodules.utils.sleep(delay);
            tempLogo.destroy();
            tempConsole.destroy();
            resolve();
        });
    }
    
    private create(): void {
        this.elements.logs = this.package.box({
            top: '50%', left: 0,
            width: '100%', height: '50%',
            label: ` AtmosphericX v${loader.submodules.utils.version()} `,
            tags: true, wrap: true,
            border: { type: 'line' },
            scrollable: true, alwaysScroll: true,
            style: { border: { fg: 'white' } }
        });
        this.elements.system = this.package.box({
            top: 0, left: '75%',
            width: '25%', height: '15%',
            label: ' System Info ',
            tags: true, wrap: true,
            border: { type: 'line' },
            scrollable: true, alwaysScroll: true,
            style: { border: { fg: 'white' } }
        });
        this.elements.sessions = this.package.box({
            top: '15%', left: '75%',
            width: '25%', height: '37%',
            label: ' Active Sessions ',
            tags: true, wrap: true,
            border: { type: 'line' },
            scrollable: true, alwaysScroll: true,
            style: { border: { fg: 'white' } }
        });
        this.elements.events = this.package.box({
            top: 0, left: 0,
            width: '75%', height: '50%',
            label: ' Active Events (X{INT}) - {STR} ',
            tags: true, wrap: true,
            border: { type: 'line' },
            scrollable: true, alwaysScroll: true,
        });
        for (const key in this.elements) {
            this.manager.append(this.elements[key]);
        }
        this.manager.render();

    }
    
    private update(): void {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        this.modifyElement(`events`, 
            !ConfigType.internal_settings.fancy_interface_feed ? 
                loader.cache.internal.logs.__events__.map(log => {return `[${log.timestamp}] ${log.message}`}).join('\n') : 
                loader.submodules.alerts.displayAlert({}, true),
            ` Active Events (X${loader.cache.external.events.features.length}) - ${loader.cache.internal.getSource} `
        )        
        this.elements.system.setContent(loader.strings.system_info
            .replace(`{UPTIME}`, loader.submodules.calculations.formatDuration(Date.now() - loader.cache.internal.metrics.start_uptime))
            .replace(`{MEMORY}`, ((loader.packages.os.totalmem() - loader.packages.os.freemem()) / (1024 * 1024)).toFixed(2))
            .replace(`{HEAP}`, (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2))
            .replace(`{EVENTS_PROCESSED}`, loader.cache.internal.metrics.events_processed.toString())
        , ` System Info `);
        this.modifyElement(`logs`, 
            loader.cache.internal.logs.__console__.map(log => {return `${log.title} [${log.timestamp}] ${log.message}`}).join('\n'),
            ` AtmosphericX v${loader.submodules.utils.version()} `
        )
        this.manager.render();
    }
    
    private modifyElement(key: string, content: string, title?: string): void {
        if (this.elements[key]) {
            this.elements[key].setContent(content);
            if (title) this.elements[key].setLabel(` ${title} `);
            this.elements[key].setScrollPerc(100);
            this.manager.render();
        }
    }

    private keybindings(): void {
        this.manager.key(['escape', 'C-c'], (ch, key) => { return process.exit(0); });
    }
}
export default Display;
