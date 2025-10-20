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
            this.manager.append(this.package.box({
                width: 'shrink', height: 'shrink',
                top: 'center', left: 'center',
                content: loader.submodules.utils.logo(),
                tags: true,
                style: { align: 'center', fg: 'white' },
                valign: 'middle', align: 'center'
            }))
            this.manager.append(this.package.box({
                top: '65%', left: 'center',
                width: '80%', height: '15%',
                label: ` Preparing AtmosphericX v${loader.submodules.utils.version()} `,
                tags: true, wrap: true,
                content: loader.cache.internal.logs.map(log => {return `${log.title} [${log.timestamp}] ${log.message}`}).join('\n'),
                border: { type: 'line' },
                scrollable: true, alwaysScroll: true,
                style: { border: { fg: 'white' } }
            }))
            this.manager.render();
            await loader.submodules.utils.sleep(delay);
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
            style: { border: { fg: 'white' } }
        });
        for (const key in this.elements) {
            this.manager.append(this.elements[key]);
        }
        this.manager.render();

    }

    private update(): void {
        this.modifyElement(`events`, loader.cache.internal.events.features.sort((a: any, b: any) => {
            const dateA = new Date(a.properties.issued).getTime();
            const dateB = new Date(b.properties.issued).getTime();
            return dateA - dateB
        }).map((event: any) => {
            return loader.strings.new_event_fancy
            .replace(`{EVENT}`, event.properties.event)
            .replace(`{ACTION_TYPE}`, event.properties.action_type)
            .replace(`{TRACKING}`, event.tracking.substring(0, 18))
            .replace(`{SENDER}`, event.properties.sender_name)
            .replace(`{ISSUED}`, event.properties.issued)
            .replace(`{EXPIRES}`, loader.submodules.calculations.getTimeRemaining(event.properties.expires))
            .replace(`{TAGS}`, event.properties.tags ? event.properties.tags.join(', ') : 'N/A')
            .replace(`{LOCATIONS}`, event.properties.locations.substring(0, 100))
            .replace(`{DISTANCE}`, (event.properties.distance?.range != null ? Object.entries(event.properties.distance.range).map(([key, value]: [string, any]) => {return `${key}: ${value.distance} ${value.unit}`;}).join(', ') : `No Distance Data Available`));
        }).join('\n'), ` Active Events (X${loader.cache.internal.events.features.length}) - ${loader.cache.internal.getSource} `);
        this.elements.system.setContent(loader.strings.system_info
            .replace(`{UPTIME}`, loader.submodules.calculations.formatUptime(Date.now() - loader.cache.internal.metrics.start_uptime))
            .replace(`{MEMORY}`, ((loader.packages.os.totalmem() - loader.packages.os.freemem()) / (1024 * 1024)).toFixed(2))
            .replace(`{HEAP}`, (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2))
            .replace(`{EVENTS_PROCESSED}`, loader.cache.internal.metrics.events_processed.toString())
        , ` System Info `);
        this.modifyElement(`logs`, 
            loader.cache.internal.logs.map(log => {return `${log.title} [${log.timestamp}] ${log.message}`}).join('\n'),
            `AtmosphericX v${loader.submodules.utils.version()}`
        )
        this.manager.render();
    }

    private modifyElement(key: string, content: string, title: string): void {
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
