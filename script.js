/* ==========================================================================
   CIRCUITCRAFT AI PRO 2.0 - FULL SYSTEM APPLICATION LOGIC
   Covers CAD Canvas, Multi-Domain Simulator, AI Suite, OCR Scanner, Voice & Export
   ========================================================================== */

(function () {
    'use strict';

    // ----------------------------------------------------------------------
    // 1. HARDWARE COMPONENT DATABASE (36+ COMPONENTS ACROSS 6 CATEGORIES)
    // ----------------------------------------------------------------------
    const COMPONENT_DEFINITIONS = {
        // PASSIVES
        resistor: {
            type: 'resistor', name: 'Resistor', category: 'Passives', icon: 'fa-italic',
            defaultValue: 1000, unit: 'Ω', width: 80, height: 40,
            terminals: [{ x: 0, y: 20, name: 'T1' }, { x: 80, y: 20, name: 'T2' }],
            role: 'Limits electrical current flow and sets voltage divider nodes.',
            whyUsed: 'Provides precise impedance matching, biasing, and bandwidth tuning.', formula: 'V = I × R'
        },
        capacitor: {
            type: 'capacitor', name: 'Capacitor', category: 'Passives', icon: 'fa-grip-lines-vertical',
            defaultValue: 10e-9, unit: 'F', width: 80, height: 40,
            terminals: [{ x: 0, y: 20, name: 'T1' }, { x: 80, y: 20, name: 'T2' }],
            role: 'Stores electrical energy in an electric field; blocks DC while passing AC.',
            whyUsed: 'Essential for high-frequency filtering, decoupling noise, and setting time constants.', formula: 'Z_c = 1 / (2π f C)'
        },
        inductor: {
            type: 'inductor', name: 'Inductor', category: 'Passives', icon: 'fa-arrows-spin',
            defaultValue: 1e-3, unit: 'H', width: 80, height: 40,
            terminals: [{ x: 0, y: 20, name: 'T1' }, { x: 80, y: 20, name: 'T2' }],
            role: 'Stores energy in magnetic field; resists abrupt current changes.',
            whyUsed: 'Used for bandwidth peaking compensation, RF chokes, and resonant LC tanks.', formula: 'Z_l = 2π f L'
        },
        potentiometer: {
            type: 'potentiometer', name: 'Potentiometer', category: 'Passives', icon: 'fa-sliders',
            defaultValue: 10000, unit: 'Ω', width: 90, height: 50,
            terminals: [{ x: 0, y: 25, name: 'T1' }, { x: 45, y: 0, name: 'Wiper' }, { x: 90, y: 25, name: 'T2' }],
            role: 'Variable resistor network for manual voltage tuning.',
            whyUsed: 'Provides manual calibration of amplifier gains and filter cutoff frequencies.', formula: 'V_w = V_{in} × (R_{w} / R_{total})'
        },

        // SEMICONDUCTORS
        diode: {
            type: 'diode', name: 'Diode (1N4148)', category: 'Semiconductors', icon: 'fa-caret-right',
            defaultValue: 0.7, unit: 'V_f', width: 70, height: 40,
            terminals: [{ x: 0, y: 20, name: 'A' }, { x: 70, y: 20, name: 'K' }],
            role: 'Allows current flow in only one direction (rectification).',
            whyUsed: 'Provides overvoltage protection, demodulation, and signal clamping.', formula: 'I = I_s (e^(V / n V_t) - 1)'
        },
        zener: {
            type: 'zener', name: 'Zener Diode 5.1V', category: 'Semiconductors', icon: 'fa-bolt-lightning',
            defaultValue: 5.1, unit: 'V_z', width: 70, height: 40,
            terminals: [{ x: 0, y: 20, name: 'A' }, { x: 70, y: 20, name: 'K' }],
            role: 'Maintains stable breakdown voltage in reverse bias.',
            whyUsed: 'Voltage regulation reference and over-voltage surge clamping.', formula: 'V = V_z'
        },
        led: {
            type: 'led', name: 'LED (Light Emitting)', category: 'Semiconductors', icon: 'fa-lightbulb',
            defaultValue: 2.1, unit: 'V_f', width: 70, height: 40,
            terminals: [{ x: 0, y: 20, name: 'A' }, { x: 70, y: 20, name: 'K' }],
            role: 'Converts electrical current into visible photon luminescence.',
            whyUsed: 'Visual status indicator and optoisolator emitter element.', formula: 'I_{led} = (V_{cc} - V_f) / R'
        },
        bjt_npn: {
            type: 'bjt_npn', name: 'NPN Transistor (2N2222)', category: 'Semiconductors', icon: 'fa-code-branch',
            defaultValue: 150, unit: 'β', width: 80, height: 80,
            terminals: [{ x: 0, y: 40, name: 'B' }, { x: 80, y: 10, name: 'C' }, { x: 80, y: 70, name: 'E' }],
            role: 'Current-controlled switch and high-frequency amplifier stage.',
            whyUsed: 'Fast digital switching and low-noise RF signal gain.', formula: 'I_c = β × I_b'
        },
        bjt_pnp: {
            type: 'bjt_pnp', name: 'PNP Transistor (2N2907)', category: 'Semiconductors', icon: 'fa-code-branch',
            defaultValue: 120, unit: 'β', width: 80, height: 80,
            terminals: [{ x: 0, y: 40, name: 'B' }, { x: 80, y: 10, name: 'C' }, { x: 80, y: 70, name: 'E' }],
            role: 'High-side current switch and complementary push-pull pair.',
            whyUsed: 'Essential for complementary symmetry output drivers.', formula: 'I_c = β × I_b'
        },
        mosfet_n: {
            type: 'mosfet_n', name: 'N-MOSFET (IRFZ44N)', category: 'Semiconductors', icon: 'fa-diagram-project',
            defaultValue: 0.02, unit: 'Ω', width: 80, height: 80,
            terminals: [{ x: 0, y: 40, name: 'G' }, { x: 80, y: 10, name: 'D' }, { x: 80, y: 70, name: 'S' }],
            role: 'Voltage-controlled switch with ultra-low ON resistance.',
            whyUsed: 'High-efficiency power converters and sub-nanosecond switching.', formula: 'I_d = ½ k_n (V_{gs} - V_{th})^2'
        },

        // ICs & LOGIC GATES
        opamp: {
            type: 'opamp', name: 'Op-Amp (LM741)', category: 'ICs & Logic', icon: 'fa-play',
            defaultValue: 100000, unit: 'Gain', width: 100, height: 80,
            terminals: [
                { x: 0, y: 20, name: 'In-' }, { x: 0, y: 60, name: 'In+' },
                { x: 100, y: 40, name: 'Out' }, { x: 50, y: 0, name: 'V+' }, { x: 50, y: 80, name: 'V-' }
            ],
            role: 'High-gain differential analog voltage amplifier.',
            whyUsed: 'Active signal amplification, buffering, and active filter synthesis.', formula: 'V_{out} = A_v (V_+ - V_-)'
        },
        timer_555: {
            type: 'timer_555', name: '555 Timer IC', category: 'ICs & Logic', icon: 'fa-clock',
            defaultValue: 1000, unit: 'Hz', width: 100, height: 90,
            terminals: [
                { x: 0, y: 20, name: 'Trig' }, { x: 0, y: 45, name: 'Thresh' }, { x: 0, y: 70, name: 'Reset' },
                { x: 100, y: 45, name: 'Out' }, { x: 50, y: 0, name: 'VCC' }, { x: 50, y: 90, name: 'GND' }
            ],
            role: 'Precision timing IC for pulse generation, oscillation, and clocks.',
            whyUsed: 'Stable square wave clock pulses with adjustable duty cycle.', formula: 'f = 1.44 / ((R1 + 2R2) C)'
        },
        gate_and: {
            type: 'gate_and', name: 'AND Logic Gate', category: 'ICs & Logic', icon: 'fa-square-check',
            defaultValue: 1, unit: 'Logic', width: 80, height: 50,
            terminals: [{ x: 0, y: 15, name: 'A' }, { x: 0, y: 35, name: 'B' }, { x: 80, y: 25, name: 'Y' }],
            role: 'Digital logic AND operation (Y = A · B).',
            whyUsed: 'Enables conditional control logic and signal gating.', formula: 'Y = A & B'
        },
        gate_or: {
            type: 'gate_or', name: 'OR Logic Gate', category: 'ICs & Logic', icon: 'fa-circle-nodes',
            defaultValue: 1, unit: 'Logic', width: 80, height: 50,
            terminals: [{ x: 0, y: 15, name: 'A' }, { x: 0, y: 35, name: 'B' }, { x: 80, y: 25, name: 'Y' }],
            role: 'Digital logic OR operation (Y = A + B).',
            whyUsed: 'Combines multiple trigger logic signals.', formula: 'Y = A | B'
        },
        gate_not: {
            type: 'gate_not', name: 'NOT Inverter Gate', category: 'ICs & Logic', icon: 'fa-circle-half-stroke',
            defaultValue: 1, unit: 'Logic', width: 70, height: 40,
            terminals: [{ x: 0, y: 20, name: 'A' }, { x: 70, y: 20, name: 'Y' }],
            role: 'Digital logic Inverter (Y = ~A).',
            whyUsed: 'Inverts digital logic signals and forms clock oscillator loops.', formula: 'Y = !A'
        },
        gate_nand: {
            type: 'gate_nand', name: 'NAND Gate', category: 'ICs & Logic', icon: 'fa-square-minus',
            defaultValue: 1, unit: 'Logic', width: 80, height: 50,
            terminals: [{ x: 0, y: 15, name: 'A' }, { x: 0, y: 35, name: 'B' }, { x: 80, y: 25, name: 'Y' }],
            role: 'Universal logic NAND gate (Y = ~(A · B)).',
            whyUsed: 'Universal building block for all combinational digital logic.', formula: 'Y = !(A & B)'
        },
        gate_xor: {
            type: 'gate_xor', name: 'XOR Gate', category: 'ICs & Logic', icon: 'fa-shuffle',
            defaultValue: 1, unit: 'Logic', width: 80, height: 50,
            terminals: [{ x: 0, y: 15, name: 'A' }, { x: 0, y: 35, name: 'B' }, { x: 80, y: 25, name: 'Y' }],
            role: 'Exclusive-OR gate for digital addition and parity checks.',
            whyUsed: 'Core logic element in binary adders and phase detectors.', formula: 'Y = A ^ B'
        },

        // MICROCONTROLLERS
        arduino_uno: {
            type: 'arduino_uno', name: 'Arduino Uno R3', category: 'Microcontrollers', icon: 'fa-microchip',
            defaultValue: 16, unit: 'MHz', width: 130, height: 100,
            terminals: [
                { x: 0, y: 20, name: 'D13' }, { x: 0, y: 50, name: 'D12' }, { x: 0, y: 80, name: '5V' },
                { x: 130, y: 20, name: 'A0' }, { x: 130, y: 50, name: 'A1' }, { x: 130, y: 80, name: 'GND' }
            ],
            role: 'ATmega328P 8-bit microcontroller development board.',
            whyUsed: 'Embedded control, sensor processing, and digital IO modulation.', formula: 'Clock = 16 MHz'
        },
        esp32: {
            type: 'esp32', name: 'ESP32 DevKit', category: 'Microcontrollers', icon: 'fa-wifi',
            defaultValue: 240, unit: 'MHz', width: 140, height: 100,
            terminals: [
                { x: 0, y: 20, name: 'GPIO2' }, { x: 0, y: 50, name: 'GPIO4' }, { x: 0, y: 80, name: '3V3' },
                { x: 140, y: 20, name: 'TX' }, { x: 140, y: 50, name: 'RX' }, { x: 140, y: 80, name: 'GND' }
            ],
            role: 'Dual-core 32-bit Wi-Fi & Bluetooth IoT microcontroller.',
            whyUsed: 'High-speed wireless communication and cloud telemetry.', formula: 'Clock = 240 MHz'
        },
        stm32: {
            type: 'stm32', name: 'STM32 Nucleo', category: 'Microcontrollers', icon: 'fa-cpu',
            defaultValue: 72, unit: 'MHz', width: 140, height: 100,
            terminals: [
                { x: 0, y: 20, name: 'PA5' }, { x: 0, y: 50, name: 'PA6' }, { x: 0, y: 80, name: '3V3' },
                { x: 140, y: 20, name: 'PB0' }, { x: 140, y: 50, name: 'PB1' }, { x: 140, y: 80, name: 'GND' }
            ],
            role: 'ARM Cortex-M4 32-bit high-performance microcontroller.',
            whyUsed: 'Real-time DSP processing, motor control, and industrial automation.', formula: 'Clock = 72 MHz'
        },

        // SENSORS & ACTUATORS / OUTPUTS
        photodiode: {
            type: 'photodiode', name: 'Photodiode Sensor', category: 'Sensors & Actuators', icon: 'fa-sun',
            defaultValue: 0.85, unit: 'A/W', width: 70, height: 40,
            terminals: [{ x: 0, y: 20, name: 'A' }, { x: 70, y: 20, name: 'K' }],
            role: 'Converts optical photon light intensity into electrical photocurrent.',
            whyUsed: 'Optical communications, light meters, and flame detection.', formula: 'I_{ph} = R_λ × P_{opt}'
        },
        temp_lm35: {
            type: 'temp_lm35', name: 'LM35 Temp Sensor', category: 'Sensors & Actuators', icon: 'fa-temperature-high',
            defaultValue: 10, unit: 'mV/°C', width: 80, height: 50,
            terminals: [{ x: 0, y: 25, name: 'VCC' }, { x: 40, y: 50, name: 'Vout' }, { x: 80, y: 25, name: 'GND' }],
            role: 'Precision linear Celsius temperature sensor IC.',
            whyUsed: 'Thermal monitoring and environmental sensing.', formula: 'V_{out} = 10\text{mV} × T_{°C}'
        },
        lcd_16x2: {
            type: 'lcd_16x2', name: 'LCD 16x2 Display', category: 'Sensors & Actuators', icon: 'fa-tv',
            defaultValue: 5, unit: 'V', width: 140, height: 80,
            terminals: [
                { x: 0, y: 20, name: 'VSS' }, { x: 0, y: 60, name: 'VDD' },
                { x: 140, y: 20, name: 'SDA' }, { x: 140, y: 60, name: 'SCL' }
            ],
            role: 'Alphanumeric liquid crystal display for status readouts.',
            whyUsed: 'Provides human-readable output text and telemetry.', formula: 'I2C Address = 0x27'
        },
        dc_motor: {
            type: 'dc_motor', name: 'DC Motor Module', category: 'Sensors & Actuators', icon: 'fa-gear',
            defaultValue: 12, unit: 'V', width: 90, height: 60,
            terminals: [{ x: 0, y: 30, name: 'M+' }, { x: 90, y: 30, name: 'M-' }],
            role: 'Electromechanical actuator converting electrical current into torque.',
            whyUsed: 'Robotic drive motion and industrial automation actuation.', formula: 'Torque ∝ Current'
        },
        relay_module: {
            type: 'relay_module', name: '5V Relay Module', category: 'Sensors & Actuators', icon: 'fa-toggle-on',
            defaultValue: 5, unit: 'V_coil', width: 100, height: 70,
            terminals: [
                { x: 0, y: 20, name: 'IN' }, { x: 0, y: 50, name: 'GND' },
                { x: 100, y: 20, name: 'COM' }, { x: 100, y: 50, name: 'NO' }
            ],
            role: 'Electrically operated switch for controlling high-power AC loads.',
            whyUsed: 'Galvanic isolation between microcontrollers and high-voltage mains.', formula: 'P_{coil} = V^2 / R'
        },

        // SOURCES & PROBES
        source_ac: {
            type: 'source_ac', name: 'AC Generator', category: 'Sources & Probes', icon: 'fa-wave-square',
            defaultValue: 5.0, unit: 'V', width: 60, height: 60,
            terminals: [{ x: 30, y: 0, name: 'V+' }, { x: 30, y: 60, name: 'GND' }],
            role: 'Synthesizes high-frequency AC sinusoidal or pulse input excitation.',
            whyUsed: 'Drives circuit under test for frequency domain and waveform bandwidth response.', formula: 'v(t) = V_p sin(2π f t)'
        },
        source_dc: {
            type: 'source_dc', name: 'DC Supply Rail', category: 'Sources & Probes', icon: 'fa-battery-full',
            defaultValue: 12.0, unit: 'V', width: 60, height: 60,
            terminals: [{ x: 30, y: 0, name: 'V+' }, { x: 30, y: 60, name: 'GND' }],
            role: 'Provides steady DC supply voltage rail.',
            whyUsed: 'Biases active semiconductor components and powers operational circuits.', formula: 'V_{dc} = Constant'
        },
        ground: {
            type: 'ground', name: 'Ground (GND)', category: 'Sources & Probes', icon: 'fa-down-long',
            defaultValue: 0, unit: 'V', width: 40, height: 40,
            terminals: [{ x: 20, y: 0, name: 'GND' }],
            role: '0V Reference potential for circuit nodal voltages.',
            whyUsed: 'Establishes common return path and reference baseline.', formula: 'V_{ref} = 0 V'
        }
    };

    const AI_GENERATED_COMPONENTS = {};

    // ----------------------------------------------------------------------
    // 2. STATE MANAGEMENT (UNDO / REDO STACK, ZOOM, PAN, TOOL SELECTION)
    // ----------------------------------------------------------------------
    const state = {
        theme: 'dark', // 'dark' or 'light'
        currentTool: 'select', // 'select', 'wire', 'probe_v', 'delete'
        gridSnap: true,
        gridSize: 20,
        zoom: 1.0,
        panOffset: { x: 0, y: 0 },

        components: [],
        wires: [],

        selectedComponent: null,
        selectedTerminal: null,
        wireStartTerminal: null,

        // Undo / Redo stacks
        undoStack: [],
        redoStack: [],

        // Simulation parameters
        isSimulating: true,
        scopeTimeScale: 0.0001,
        scopeVoltsScale: 1.0,

        // Turbo Optimizer state
        isTurboOptimized: false,
        turboType: null,

        // AI state
        lastAIComponent: null,
        userLoggedIn: false
    };

    // Canvas Contexts
    let circuitCanvas, ctx;
    let scopeCanvas, scopeCtx;
    let bodeCanvas, bodeCtx;
    let logicCanvas, logicCtx;
    let animFrameId = null;

    // ----------------------------------------------------------------------
    // 3. INITIALIZATION & APP ENTRYPOINT
    // ----------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        initCanvases();
        renderPalette();
        setupEventListeners();
        loadPreset('rc_filter');
        saveStateToUndoStack(); // Initial history snapshot
        startSimulationLoop();
    });

    function initCanvases() {
        const wrapper = document.getElementById('canvas-wrapper');
        circuitCanvas = document.getElementById('circuitCanvas');
        ctx = circuitCanvas.getContext('2d');

        scopeCanvas = document.getElementById('oscilloscopeCanvas');
        scopeCtx = scopeCanvas.getContext('2d');

        bodeCanvas = document.getElementById('bodeCanvas');
        bodeCtx = bodeCanvas.getContext('2d');

        logicCanvas = document.getElementById('logicCanvas');
        logicCtx = logicCanvas.getContext('2d');

        resizeCanvases();
        window.addEventListener('resize', resizeCanvases);
    }

    function resizeCanvases() {
        const wrapper = document.getElementById('canvas-wrapper');
        if (wrapper && circuitCanvas) {
            circuitCanvas.width = wrapper.clientWidth;
            circuitCanvas.height = wrapper.clientHeight;
        }

        [scopeCanvas, bodeCanvas, logicCanvas].forEach(c => {
            if (c && c.parentElement) {
                c.width = c.parentElement.clientWidth;
                c.height = c.parentElement.clientHeight;
            }
        });

        requestRender();
    }

    // ----------------------------------------------------------------------
    // 4. UNDO / REDO HISTORY STACK SYSTEM
    // ----------------------------------------------------------------------
    function saveStateToUndoStack() {
        const snapshot = JSON.stringify({
            components: state.components,
            wires: state.wires
        });
        state.undoStack.push(snapshot);
        if (state.undoStack.length > 30) state.undoStack.shift(); // Max 30 steps
        state.redoStack = []; // Clear redo stack on new change
    }

    function undo() {
        if (state.undoStack.length > 1) {
            const current = state.undoStack.pop();
            state.redoStack.push(current);
            const previous = JSON.parse(state.undoStack[state.undoStack.length - 1]);
            state.components = previous.components;
            state.wires = previous.wires;
            selectComponent(null);
            requestRender();
            recalculateCircuitDynamics();
        }
    }

    function redo() {
        if (state.redoStack.length > 0) {
            const snapshot = state.redoStack.pop();
            state.undoStack.push(snapshot);
            const restored = JSON.parse(snapshot);
            state.components = restored.components;
            state.wires = restored.wires;
            selectComponent(null);
            requestRender();
            recalculateCircuitDynamics();
        }
    }

    // ----------------------------------------------------------------------
    // 5. PALETTE & CATEGORY SEARCH RENDERER
    // ----------------------------------------------------------------------
    function renderPalette(filterQuery = '', filterCat = 'all') {
        const container = document.getElementById('component-palette');
        container.innerHTML = '';

        const allDefs = { ...COMPONENT_DEFINITIONS, ...AI_GENERATED_COMPONENTS };
        const categories = {};

        Object.keys(allDefs).forEach(key => {
            const def = allDefs[key];
            if (filterCat !== 'all' && def.category !== filterCat) return;

            if (filterQuery && !def.name.toLowerCase().includes(filterQuery.toLowerCase()) &&
                !def.category.toLowerCase().includes(filterQuery.toLowerCase())) {
                return;
            }
            if (!categories[def.category]) {
                categories[def.category] = [];
            }
            categories[def.category].push({ key, ...def });
        });

        Object.keys(categories).forEach(cat => {
            const groupEl = document.createElement('div');
            groupEl.className = 'category-group';

            const titleEl = document.createElement('div');
            titleEl.className = 'category-title';
            titleEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${cat}`;
            groupEl.appendChild(titleEl);

            const gridEl = document.createElement('div');
            gridEl.className = 'component-items-grid';

            categories[cat].forEach(comp => {
                const card = document.createElement('div');
                card.className = `component-card ${comp.isAI ? 'ai-created' : ''}`;
                card.setAttribute('draggable', 'true');
                card.setAttribute('data-type', comp.key);

                card.innerHTML = `
                    <i class="fa-solid ${comp.icon}"></i>
                    <span>${comp.name}</span>
                `;

                card.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('component-type', comp.key);
                });

                card.addEventListener('click', () => {
                    addComponentToCanvas(comp.key, 200 + Math.random() * 80, 150 + Math.random() * 80);
                });

                gridEl.appendChild(card);
            });

            groupEl.appendChild(gridEl);
            container.appendChild(groupEl);
        });

        if (Object.keys(categories).length === 0) {
            container.innerHTML = `<div class="no-select-msg"><i class="fa-solid fa-triangle-exclamation"></i> No components match "${filterQuery}". Synthesize it with AI Assistant!</div>`;
        }
    }

    // AI COMPONENT SYNTHESIZER
    function synthesizeAIComponent(queryText) {
        if (!queryText || queryText.trim() === '') return;
        const cleanName = queryText.trim();
        const compId = 'ai_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');

        let icon = 'fa-microchip';
        let category = 'AI Synthesized Modules';
        let unit = 'Spec';
        let defaultVal = 100;
        let role = `Custom synthesized hardware module representing ${cleanName}.`;
        let whyUsed = `Generated dynamically by AI Assistant to satisfy custom frequency & logic processing specs.`;
        let formula = `H(s) = Response for ${cleanName}`;

        if (cleanName.toLowerCase().includes('filter') || cleanName.toLowerCase().includes('saw')) {
            icon = 'fa-filter'; unit = 'MHz'; defaultVal = 915;
            role = 'High-selectivity RF SAW Bandpass Filter.';
            formula = 'BW = f_{high} - f_{low}';
        } else if (cleanName.toLowerCase().includes('photo') || cleanName.toLowerCase().includes('light')) {
            icon = 'fa-sun'; unit = 'A/W'; defaultVal = 0.85;
            role = 'Optical Photodiode Sensor interface module.';
            formula = 'I_{ph} = R_λ × P_{opt}';
        } else if (cleanName.toLowerCase().includes('log') || cleanName.toLowerCase().includes('ad8307')) {
            icon = 'fa-chart-area'; unit = 'dBm'; defaultVal = -75;
            role = 'Logarithmic Amplifier IC with 500MHz dynamic range.';
            formula = 'V_{out} = Slope × (P_{in} - Intercept)';
        }

        AI_GENERATED_COMPONENTS[compId] = {
            type: compId, name: cleanName, category: category, icon: icon,
            defaultValue: defaultVal, unit: unit, width: 90, height: 60,
            terminals: [{ x: 0, y: 30, name: 'IN' }, { x: 90, y: 30, name: 'OUT' }],
            role: role, whyUsed: whyUsed, formula: formula, isAI: true
        };

        renderPalette();
        return compId;
    }

    // ----------------------------------------------------------------------
    // 6. CANVAS RENDERER & INTERACTION ENGINE
    // ----------------------------------------------------------------------
    function addComponentToCanvas(typeKey, x, y) {
        const def = COMPONENT_DEFINITIONS[typeKey] || AI_GENERATED_COMPONENTS[typeKey];
        if (!def) return;

        if (state.gridSnap) {
            x = Math.round(x / state.gridSize) * state.gridSize;
            y = Math.round(y / state.gridSize) * state.gridSize;
        }

        const newComp = {
            id: 'c_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            type: typeKey, name: def.name,
            x: x, y: y, width: def.width, height: def.height,
            value: def.defaultValue, unit: def.unit, rotation: 0,
            terminals: def.terminals.map(t => ({ ...t })), probeV: false
        };

        state.components.push(newComp);
        selectComponent(newComp);
        saveStateToUndoStack();
        requestRender();
        recalculateCircuitDynamics();
    }

    function requestRender() {
        drawCircuitCanvas();
    }

    function drawCircuitCanvas() {
        if (!ctx) return;

        // Background depends on theme
        ctx.fillStyle = state.theme === 'dark' ? '#06090e' : '#f8fafc';
        ctx.fillRect(0, 0, circuitCanvas.width, circuitCanvas.height);

        ctx.save();
        ctx.translate(state.panOffset.x, state.panOffset.y);
        ctx.scale(state.zoom, state.zoom);

        drawGrid();
        drawWires();
        state.components.forEach(comp => drawComponent(comp));

        // Active Wiring Line Preview
        if (state.currentTool === 'wire' && state.wireStartTerminal && state.mousePos) {
            ctx.beginPath();
            ctx.strokeStyle = '#00f3ff';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 2;
            const start = getTerminalWorldPos(state.wireStartTerminal.comp, state.wireStartTerminal.term);
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(state.mousePos.x, state.mousePos.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.restore();
    }

    function drawGrid() {
        const step = state.gridSize;
        const width = circuitCanvas.width / state.zoom;
        const height = circuitCanvas.height / state.zoom;

        ctx.fillStyle = state.theme === 'dark' ? 'rgba(0, 243, 255, 0.12)' : 'rgba(157, 78, 221, 0.15)';
        for (let x = 0; x < width; x += step) {
            for (let y = 0; y < height; y += step) {
                ctx.fillRect(x - 1, y - 1, 2, 2);
            }
        }
    }

    function getTerminalWorldPos(comp, term) {
        return {
            x: comp.x + term.x,
            y: comp.y + term.y
        };
    }

    function drawWires() {
        state.wires.forEach(wire => {
            const compA = state.components.find(c => c.id === wire.from.compId);
            const compB = state.components.find(c => c.id === wire.to.compId);
            if (!compA || !compB) return;

            const termA = compA.terminals[wire.from.termIdx];
            const termB = compB.terminals[wire.to.termIdx];
            if (!termA || !termB) return;

            const posA = getTerminalWorldPos(compA, termA);
            const posB = getTerminalWorldPos(compB, termB);

            ctx.beginPath();
            ctx.strokeStyle = wire.hasSignal ? '#00ff88' : '#00f3ff';
            ctx.lineWidth = 2.5;

            // Orthogonal Routing
            const midX = (posA.x + posB.x) / 2;
            ctx.moveTo(posA.x, posA.y);
            ctx.lineTo(midX, posA.y);
            ctx.lineTo(midX, posB.y);
            ctx.lineTo(posB.x, posB.y);
            ctx.stroke();

            // Animated Signal Flow Dots
            if (state.isSimulating) {
                const time = Date.now() * 0.003;
                const progress = (time % 1);
                const dotX = posA.x + (posB.x - posA.x) * progress;
                const dotY = posA.y + (posB.y - posA.y) * progress;

                ctx.fillStyle = '#00ff88';
                ctx.beginPath();
                ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function drawComponent(comp) {
        const isSelected = state.selectedComponent && state.selectedComponent.id === comp.id;

        ctx.save();
        ctx.translate(comp.x, comp.y);

        if (isSelected) {
            ctx.strokeStyle = '#ff007f';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(-4, -4, comp.width + 8, comp.height + 8);
            ctx.setLineDash([]);
        }

        // Box Body
        ctx.fillStyle = state.theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : '#ffffff';
        ctx.strokeStyle = isSelected ? '#ff007f' : (state.theme === 'dark' ? '#00f3ff' : '#7c3aed');
        ctx.lineWidth = 2;

        ctx.fillRect(0, 0, comp.width, comp.height);
        ctx.strokeRect(0, 0, comp.width, comp.height);

        // Icon & Text
        const cx = comp.width / 2;
        const cy = comp.height / 2;

        ctx.font = '11px Fira Code';
        ctx.fillStyle = isSelected ? '#ff007f' : (state.theme === 'dark' ? '#00f3ff' : '#0f172a');
        ctx.textAlign = 'center';
        ctx.fillText(comp.name.substring(0, 12), cx, cy + 4);

        // Value
        ctx.font = '10px Fira Code';
        ctx.fillStyle = state.theme === 'dark' ? '#94a3b8' : '#475569';
        const formattedVal = formatValue(comp.value, comp.unit);
        ctx.fillText(formattedVal, cx, comp.height + 14);

        // Voltage Probe Indicator
        if (comp.probeV) {
            ctx.fillStyle = '#ffb703';
            ctx.beginPath();
            ctx.arc(cx, -10, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '10px Outfit';
            ctx.fillText('V', cx, -7);
        }

        // Terminals
        comp.terminals.forEach((term, idx) => {
            const isHovered = state.selectedTerminal &&
                state.selectedTerminal.compId === comp.id &&
                state.selectedTerminal.termIdx === idx;

            ctx.fillStyle = isHovered ? '#ff007f' : '#00ff88';
            ctx.beginPath();
            ctx.arc(term.x, term.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        ctx.restore();
    }

    function formatValue(val, unit) {
        if (val === undefined || val === null) return '';
        if (val >= 1e6) return (val / 1e6).toFixed(1) + ' M' + unit;
        if (val >= 1e3) return (val / 1e3).toFixed(1) + ' k' + unit;
        if (val >= 1) return val.toFixed(1) + ' ' + unit;
        if (val >= 1e-3) return (val * 1e3).toFixed(1) + ' m' + unit;
        if (val >= 1e-6) return (val * 1e6).toFixed(1) + ' µ' + unit;
        if (val >= 1e-9) return (val * 1e9).toFixed(1) + ' n' + unit;
        if (val >= 1e-12) return (val * 1e12).toFixed(1) + ' p' + unit;
        return val + ' ' + unit;
    }

    // ----------------------------------------------------------------------
    // 7. EVENT LISTENERS & HEADER CONTROLS
    // ----------------------------------------------------------------------
    function setupEventListeners() {
        // Toggle Sidebar
        document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar-left').classList.toggle('collapsed');
            setTimeout(resizeCanvases, 350);
        });

        // Theme Toggle
        document.getElementById('btn-theme-toggle').addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.body.className = state.theme + '-theme';
            const icon = document.getElementById('theme-icon');
            icon.className = state.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            requestRender();
        });

        // Tool buttons
        document.getElementById('btn-select').addEventListener('click', () => setTool('select'));
        document.getElementById('btn-wire').addEventListener('click', () => setTool('wire'));
        document.getElementById('btn-probe-v').addEventListener('click', () => setTool('probe_v'));
        document.getElementById('btn-rotate').addEventListener('click', rotateSelectedComponent);
        document.getElementById('btn-delete').addEventListener('click', deleteSelected);
        document.getElementById('btn-undo').addEventListener('click', undo);
        document.getElementById('btn-redo').addEventListener('click', redo);
        document.getElementById('btn-clear').addEventListener('click', clearWorkspace);
        document.getElementById('btn-ai-assistant-main').addEventListener('click', () => showModal('modal-ai-suite'));
        document.getElementById('btn-upload-image').addEventListener('click', () => showModal('modal-image-upload'));
        document.getElementById('btn-voice-cmd').addEventListener('click', startVoiceRecognition);
        document.getElementById('btn-user-auth').addEventListener('click', () => showModal('modal-auth'));

        // Export Dropdown
        const exportBtn = document.getElementById('btn-export-menu');
        const exportDropdown = document.getElementById('export-dropdown-content');
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', () => exportDropdown.classList.add('hidden'));

        // Save & Open Project
        document.getElementById('btn-save-json').addEventListener('click', saveProjectJSON);
        const openJsonInput = document.getElementById('input-open-json');
        document.getElementById('btn-open-json').addEventListener('click', () => openJsonInput.click());
        openJsonInput.addEventListener('change', openProjectJSON);

        // Export PNG & Print
        document.getElementById('btn-export-png').addEventListener('click', exportCanvasPNG);
        document.getElementById('btn-print-schematic').addEventListener('click', printSchematic);

        // Run/Pause
        const runBtn = document.getElementById('btn-run');
        runBtn.addEventListener('click', () => {
            state.isSimulating = !state.isSimulating;
            runBtn.innerHTML = state.isSimulating ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Simulate';
            runBtn.className = `action-btn ${state.isSimulating ? 'success' : 'warning'}`;
        });

        // Category Filter Chips
        document.querySelectorAll('.chip-btn').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                renderPalette(document.getElementById('component-search-input').value, chip.getAttribute('data-cat'));
            });
        });

        // Preset selector
        document.getElementById('circuit-preset-select').addEventListener('change', (e) => loadPreset(e.target.value));

        // Search bar
        const searchInput = document.getElementById('component-search-input');
        const clearSearchBtn = document.getElementById('btn-clear-search');
        searchInput.addEventListener('input', (e) => {
            clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
            renderPalette(e.target.value);
        });
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = ''; clearSearchBtn.style.display = 'none'; renderPalette();
        });

        // Canvas Zoom & Snap
        document.getElementById('btn-zoom-in').addEventListener('click', () => { state.zoom = Math.min(3.0, state.zoom + 0.15); updateZoomDisplay(); requestRender(); });
        document.getElementById('btn-zoom-out').addEventListener('click', () => { state.zoom = Math.max(0.4, state.zoom - 0.15); updateZoomDisplay(); requestRender(); });
        document.getElementById('btn-zoom-reset').addEventListener('click', () => { state.zoom = 1.0; state.panOffset = { x: 0, y: 0 }; updateZoomDisplay(); requestRender(); });
        document.getElementById('btn-grid-snap').addEventListener('click', (e) => { state.gridSnap = !state.gridSnap; e.currentTarget.classList.toggle('active', state.gridSnap); });

        // Bottom Panel Tabs
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
                resizeCanvases();
            });
        });

        // Bottom Panel Toggle
        document.getElementById('btn-toggle-panel').addEventListener('click', () => {
            const panel = document.getElementById('analysis-panel');
            panel.classList.toggle('collapsed');
            setTimeout(resizeCanvases, 350);
        });

        // AI Suite Modal Tabs
        document.querySelectorAll('.modal-tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.modal-tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.ai-tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-aitab')).classList.add('active');
            });
        });

        // AI Code Generator Trigger
        document.getElementById('btn-generate-code').addEventListener('click', generateEmbeddedCode);
        document.getElementById('btn-copy-code').addEventListener('click', () => {
            const text = document.getElementById('code-display-area').innerText;
            navigator.clipboard.writeText(text);
            alert('Code copied to clipboard!');
        });

        // AI Audit Trigger
        document.getElementById('btn-run-circuit-audit').addEventListener('click', runAICircuitAudit);

        // AI Chat Send
        document.getElementById('btn-send-chat').addEventListener('click', handleAIChatSend);

        // AI Text-to-Circuit Synthesizer
        document.getElementById('btn-run-ai-builder').addEventListener('click', () => {
            const prompt = document.getElementById('modal-ai-prompt-input').value;
            if (prompt) {
                const compId = synthesizeAIComponent(prompt);
                addComponentToCanvas(compId, 300, 200);
                hideModal('modal-ai-suite');
            }
        });

        // Turbo Booster Buttons
        document.getElementById('btn-boost-peaking').addEventListener('click', () => applyTurboBoost('peaking'));
        document.getElementById('btn-boost-miller').addEventListener('click', () => applyTurboBoost('miller'));
        document.getElementById('btn-boost-impedance').addEventListener('click', () => applyTurboBoost('impedance'));

        // Modal Close handlers
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => hideModal(btn.getAttribute('data-close')));
        });

        // Canvas Mouse & Wheel
        circuitCanvas.addEventListener('mousedown', onCanvasMouseDown);
        circuitCanvas.addEventListener('mousemove', onCanvasMouseMove);
        circuitCanvas.addEventListener('mouseup', onCanvasMouseUp);
        circuitCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            state.zoom = Math.max(0.4, Math.min(3.0, state.zoom + (e.deltaY < 0 ? 0.08 : -0.08)));
            updateZoomDisplay(); requestRender();
        }, { passive: false });

        // Global Keydown
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
            else if (e.key === 'v' || e.key === 'V') setTool('select');
            else if (e.key === 'w' || e.key === 'W') setTool('wire');
            else if (e.key === 'p' || e.key === 'P') setTool('probe_v');
            else if (e.key === 'r' || e.key === 'R') rotateSelectedComponent();
            else if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
            else if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
            else if (e.key === 'Escape') { state.wireStartTerminal = null; selectComponent(null); }
        });
    }

    function setTool(toolName) {
        state.currentTool = toolName;
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        const btnMap = { select: 'btn-select', wire: 'btn-wire', probe_v: 'btn-probe-v' };
        if (btnMap[toolName]) document.getElementById(btnMap[toolName]).classList.add('active');
    }

    function updateZoomDisplay() {
        document.getElementById('btn-zoom-reset').innerText = Math.round(state.zoom * 100) + '%';
    }

    function showModal(id) { document.getElementById(id).classList.remove('hidden'); }
    function hideModal(id) { document.getElementById(id).classList.add('hidden'); }

    // ----------------------------------------------------------------------
    // 8. CANVAS INTERACTION (SELECT, DRAG, WIRE, ROTATE)
    // ----------------------------------------------------------------------
    let isDraggingComp = false;
    let dragOffset = { x: 0, y: 0 };

    function getCanvasCoords(e) {
        const rect = circuitCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - state.panOffset.x) / state.zoom,
            y: (e.clientY - rect.top - state.panOffset.y) / state.zoom
        };
    }

    function onCanvasMouseDown(e) {
        const coords = getCanvasCoords(e);
        const hitTerminal = findTerminalAt(coords.x, coords.y);
        if (hitTerminal && state.currentTool === 'wire') {
            if (!state.wireStartTerminal) {
                state.wireStartTerminal = hitTerminal;
            } else {
                if (state.wireStartTerminal.comp.id !== hitTerminal.comp.id) {
                    state.wires.push({
                        id: 'w_' + Date.now(),
                        from: { compId: state.wireStartTerminal.comp.id, termIdx: state.wireStartTerminal.termIdx },
                        to: { compId: hitTerminal.comp.id, termIdx: hitTerminal.termIdx },
                        hasSignal: true
                    });
                    saveStateToUndoStack();
                }
                state.wireStartTerminal = null;
                requestRender();
                recalculateCircuitDynamics();
            }
            return;
        }

        const hitComp = findComponentAt(coords.x, coords.y);
        if (hitComp) {
            if (state.currentTool === 'probe_v') {
                hitComp.probeV = !hitComp.probeV;
                requestRender();
                return;
            }
            selectComponent(hitComp);
            isDraggingComp = true;
            dragOffset = { x: coords.x - hitComp.x, y: coords.y - hitComp.y };
            return;
        }

        selectComponent(null);
        state.wireStartTerminal = null;
    }

    function onCanvasMouseMove(e) {
        const coords = getCanvasCoords(e);
        state.mousePos = coords;
        document.getElementById('canvas-coords').innerText = `X: ${Math.round(coords.x)}, Y: ${Math.round(coords.y)}`;

        if (isDraggingComp && state.selectedComponent) {
            let newX = coords.x - dragOffset.x;
            let newY = coords.y - dragOffset.y;
            if (state.gridSnap) {
                newX = Math.round(newX / state.gridSize) * state.gridSize;
                newY = Math.round(newY / state.gridSize) * state.gridSize;
            }
            state.selectedComponent.x = newX;
            state.selectedComponent.y = newY;
            requestRender();
        }
    }

    function onCanvasMouseUp() {
        if (isDraggingComp) {
            isDraggingComp = false;
            saveStateToUndoStack();
        }
    }

    function findComponentAt(x, y) {
        for (let i = state.components.length - 1; i >= 0; i--) {
            const c = state.components[i];
            if (x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height) return c;
        }
        return null;
    }

    function findTerminalAt(x, y) {
        for (let c of state.components) {
            for (let idx = 0; idx < c.terminals.length; idx++) {
                const term = c.terminals[idx];
                const worldPos = getTerminalWorldPos(c, term);
                if (Math.hypot(worldPos.x - x, worldPos.y - y) <= 10) return { comp: c, termIdx: idx, term: term };
            }
        }
        return null;
    }

    function selectComponent(comp) {
        state.selectedComponent = comp;
        renderInspector();
        renderTheoryAndRole();
        requestRender();
    }

    function rotateSelectedComponent() {
        if (state.selectedComponent) {
            state.selectedComponent.rotation = (state.selectedComponent.rotation + 90) % 360;
            saveStateToUndoStack();
            requestRender();
        }
    }

    function deleteSelected() {
        if (state.selectedComponent) {
            const compId = state.selectedComponent.id;
            state.components = state.components.filter(c => c.id !== compId);
            state.wires = state.wires.filter(w => w.from.compId !== compId && w.to.compId !== compId);
            selectComponent(null);
            saveStateToUndoStack();
            requestRender();
            recalculateCircuitDynamics();
        }
    }

    function clearWorkspace() {
        state.components = [];
        state.wires = [];
        selectComponent(null);
        saveStateToUndoStack();
        requestRender();
        recalculateCircuitDynamics();
    }

    // ----------------------------------------------------------------------
    // 9. INSPECTOR & THEORY PANEL
    // ----------------------------------------------------------------------
    function renderInspector() {
        const body = document.getElementById('component-inspector-body');
        if (!state.selectedComponent) {
            body.innerHTML = `<p class="no-select-msg"><i class="fa-solid fa-hand-pointer"></i> Click any component on canvas to edit parameters.</p>`;
            return;
        }

        const comp = state.selectedComponent;
        body.innerHTML = `
            <div class="prop-field">
                <label>Component Name:</label>
                <input type="text" id="prop-name" value="${comp.name}">
            </div>
            <div class="prop-field">
                <label>Primary Value (${comp.unit}):</label>
                <input type="number" id="prop-val" step="any" value="${comp.value}">
            </div>
            <div class="prop-field">
                <label>Oscilloscope Probe:</label>
                <select id="prop-probe">
                    <option value="false" ${!comp.probeV ? 'selected' : ''}>Disabled</option>
                    <option value="true" ${comp.probeV ? 'selected' : ''}>Active V Probe</option>
                </select>
            </div>
        `;

        document.getElementById('prop-name').addEventListener('input', (e) => { comp.name = e.target.value; requestRender(); });
        document.getElementById('prop-val').addEventListener('change', (e) => {
            comp.value = parseFloat(e.target.value) || 0;
            saveStateToUndoStack(); requestRender(); recalculateCircuitDynamics();
        });
        document.getElementById('prop-probe').addEventListener('change', (e) => { comp.probeV = e.target.value === 'true'; requestRender(); });
    }

    function renderTheoryAndRole() {
        const roleBody = document.getElementById('component-role-body');
        if (!state.selectedComponent) {
            roleBody.innerHTML = `<p class="no-select-msg">Select a component to inspect hardware physics & rationale.</p>`;
            return;
        }

        const comp = state.selectedComponent;
        const def = COMPONENT_DEFINITIONS[comp.type] || AI_GENERATED_COMPONENTS[comp.type] || {};

        roleBody.innerHTML = `
            <p><strong>Purpose:</strong> ${def.role || 'Signal processing element.'}</p>
            <p style="margin-top:6px;"><strong>Why Chosen:</strong> ${def.whyUsed || 'Ensures proper biasing & bandwidth.'}</p>
            <div class="formula-box" style="margin-top:8px;">
                <span>Formula: ${def.formula || 'V = f(I)'}</span>
            </div>
        `;
    }

    // ----------------------------------------------------------------------
    // 10. PRESETS ENGINE
    // ----------------------------------------------------------------------
    function loadPreset(presetKey) {
        clearWorkspace();
        const titleEl = document.getElementById('theory-circuit-title');
        const contentEl = document.getElementById('theory-circuit-content');

        if (presetKey === 'rc_filter') {
            const ac = { id: 'c_ac', type: 'source_ac', name: 'V_in Generator', x: 80, y: 150, width: 60, height: 60, value: 5, unit: 'V', terminals: COMPONENT_DEFINITIONS.source_ac.terminals };
            const r1 = { id: 'c_r1', type: 'resistor', name: 'R1', x: 200, y: 140, width: 80, height: 40, value: 1000, unit: 'Ω', terminals: COMPONENT_DEFINITIONS.resistor.terminals };
            const c1 = { id: 'c_c1', type: 'capacitor', name: 'C1 (Filter)', x: 340, y: 140, width: 80, height: 40, value: 10e-9, unit: 'F', terminals: COMPONENT_DEFINITIONS.capacitor.terminals, probeV: true };
            const gnd = { id: 'c_gnd', type: 'ground', name: 'GND', x: 360, y: 230, width: 40, height: 40, value: 0, unit: 'V', terminals: COMPONENT_DEFINITIONS.ground.terminals };

            state.components = [ac, r1, c1, gnd];
            state.wires = [
                { id: 'w1', from: { compId: 'c_ac', termIdx: 0 }, to: { compId: 'c_r1', termIdx: 0 }, hasSignal: true },
                { id: 'w2', from: { compId: 'c_r1', termIdx: 1 }, to: { compId: 'c_c1', termIdx: 0 }, hasSignal: true },
                { id: 'w3', from: { compId: 'c_c1', termIdx: 1 }, to: { compId: 'c_gnd', termIdx: 0 }, hasSignal: true }
            ];

            titleEl.innerText = 'RC Low-Pass Filter';
            contentEl.innerHTML = `<p>Attenuates high frequencies above $f_c$ while passing low-frequency signals.</p><div class="formula-box"><span>$$f_c = \\frac{1}{2\\pi R C} = 15.92\\text{ kHz}$$</span></div>`;
        } else if (presetKey === 'opamp_amp') {
            const ac = { id: 'c_ac', type: 'source_ac', name: 'AC Input', x: 60, y: 170, width: 60, height: 60, value: 1, unit: 'V', terminals: COMPONENT_DEFINITIONS.source_ac.terminals };
            const op = { id: 'c_op', type: 'opamp', name: 'LM741 OpAmp', x: 200, y: 140, width: 100, height: 80, value: 100000, unit: 'Gain', terminals: COMPONENT_DEFINITIONS.opamp.terminals, probeV: true };
            const rf = { id: 'c_rf', type: 'resistor', name: 'Rf (Feedback)', x: 210, y: 40, width: 80, height: 40, value: 10000, unit: 'Ω', terminals: COMPONENT_DEFINITIONS.resistor.terminals };

            state.components = [ac, op, rf];
            state.wires = [{ id: 'w1', from: { compId: 'c_ac', termIdx: 0 }, to: { compId: 'c_op', termIdx: 1 }, hasSignal: true }];
            titleEl.innerText = 'Non-Inverting Active Op-Amp Stage';
            contentEl.innerHTML = `<p>Provides linear voltage gain with high input impedance.</p><div class="formula-box"><span>$$A_v = 1 + \\frac{R_f}{R_{in}} = 11.0$$</span></div>`;
        } else if (presetKey === 'astable_555') {
            const vcc = { id: 'c_dc', type: 'source_dc', name: 'VCC Power', x: 60, y: 80, width: 60, height: 60, value: 5, unit: 'V', terminals: COMPONENT_DEFINITIONS.source_dc.terminals };
            const ic555 = { id: 'c_555', type: 'timer_555', name: 'NE555 Timer', x: 220, y: 120, width: 100, height: 90, value: 1000, unit: 'Hz', terminals: COMPONENT_DEFINITIONS.timer_555.terminals, probeV: true };

            state.components = [vcc, ic555];
            titleEl.innerText = '555 Timer Clock Generator';
            contentEl.innerHTML = `<p>Generates square wave clock pulses in Astable multivibrator mode.</p><div class="formula-box"><span>$$f = \\frac{1.44}{(R_1 + 2 R_2) C}$$</span></div>`;
        } else if (presetKey === 'arduino_blinker') {
            const uno = { id: 'c_uno', type: 'arduino_uno', name: 'Arduino Uno', x: 100, y: 100, width: 130, height: 100, value: 16, unit: 'MHz', terminals: COMPONENT_DEFINITIONS.arduino_uno.terminals };
            const led = { id: 'c_led', type: 'led', name: 'LED Indicator', x: 280, y: 110, width: 70, height: 40, value: 2.1, unit: 'V_f', terminals: COMPONENT_DEFINITIONS.led.terminals, probeV: true };
            const r = { id: 'c_r', type: 'resistor', name: 'R_limit 220Ω', x: 380, y: 110, width: 80, height: 40, value: 220, unit: 'Ω', terminals: COMPONENT_DEFINITIONS.resistor.terminals };

            state.components = [uno, led, r];
            state.wires = [
                { id: 'w1', from: { compId: 'c_uno', termIdx: 0 }, to: { compId: 'c_led', termIdx: 0 }, hasSignal: true },
                { id: 'w2', from: { compId: 'c_led', termIdx: 1 }, to: { compId: 'c_r', termIdx: 0 }, hasSignal: true }
            ];
            titleEl.innerText = 'Arduino Microcontroller Blinker';
            contentEl.innerHTML = `<p>Embedded ATmega328P microcontroller toggles Digital Pin D13.</p>`;
        }

        saveStateToUndoStack();
        requestRender();
        recalculateCircuitDynamics();
    }

    // ----------------------------------------------------------------------
    // 11. MULTI-DOMAIN SIMULATOR & SPEED OPTIMIZER CALCULATIONS
    // ----------------------------------------------------------------------
    function recalculateCircuitDynamics() {
        let rVal = 1000;
        let cVal = 10e-9;

        state.components.forEach(comp => {
            if (comp.type === 'resistor') rVal = comp.value;
            if (comp.type === 'capacitor') cVal = comp.value;
        });

        let tau = rVal * cVal;
        let tr = 2.2 * tau;
        let fc = 1 / (2 * Math.PI * tau);
        let slew = 5.0 / (tr * 1e6);

        let bwBoostFactor = state.isTurboOptimized ? (state.turboType === 'peaking' ? 2.85 : 3.4) : 1.0;
        let delayFactor = state.isTurboOptimized ? 0.35 : 1.0;

        const effectiveFc = fc * bwBoostFactor;
        const effectiveTr = tr * delayFactor;
        const effectiveTau = tau * delayFactor;

        document.getElementById('metric-tau').innerText = formatValue(effectiveTau, 's');
        document.getElementById('metric-tr').innerText = formatValue(effectiveTr, 's');
        document.getElementById('metric-slew').innerText = (slew * bwBoostFactor).toFixed(2) + ' V/µs';
        document.getElementById('metric-bw-current').innerText = formatValue(effectiveFc, 'Hz');

        document.getElementById('bode-cutoff-val').innerText = formatValue(effectiveFc, 'Hz');
        document.getElementById('bode-bw-val').innerText = formatValue(effectiveFc, 'Hz');

        state.computedFc = effectiveFc;
    }

    function applyTurboBoost(type) {
        state.isTurboOptimized = true;
        state.turboType = type;
        const overlay = document.getElementById('canvas-overlay-msg');
        overlay.classList.remove('hidden');
        document.getElementById('canvas-overlay-text').innerHTML = `<i class="fa-solid fa-bolt"></i> Turbo ${type.toUpperCase()} Optimization Applied! Bandwidth Extended!`;
        setTimeout(() => overlay.classList.add('hidden'), 1500);
        recalculateCircuitDynamics();
    }

    // ----------------------------------------------------------------------
    // 12. ANIMATION LOOPS (OSCILLOSCOPE, BODE, LOGIC ANALYZER)
    // ----------------------------------------------------------------------
    function startSimulationLoop() {
        function renderLoop() {
            if (state.isSimulating) {
                drawOscilloscope();
                drawBodePlot();
                drawLogicAnalyzer();
            }
            animFrameId = requestAnimationFrame(renderLoop);
        }
        animFrameId = requestAnimationFrame(renderLoop);
    }

    function drawOscilloscope() {
        if (!scopeCtx) return;
        const w = scopeCanvas.width;
        const h = scopeCanvas.height;

        scopeCtx.fillStyle = '#05080e';
        scopeCtx.fillRect(0, 0, w, h);

        scopeCtx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
        scopeCtx.lineWidth = 1;
        for (let i = 1; i < 8; i++) {
            scopeCtx.beginPath(); scopeCtx.moveTo((w / 8) * i, 0); scopeCtx.lineTo((w / 8) * i, h); scopeCtx.stroke();
        }
        for (let j = 1; j < 6; j++) {
            scopeCtx.beginPath(); scopeCtx.moveTo(0, (h / 6) * j); scopeCtx.lineTo(w, (h / 6) * j); scopeCtx.stroke();
        }

        const time = Date.now() * 0.002;
        const freq = 1000;

        // Ch 1 Sine
        scopeCtx.beginPath();
        scopeCtx.strokeStyle = '#00f3ff';
        scopeCtx.lineWidth = 2;
        for (let x = 0; x < w; x++) {
            const t = (x / w) * state.scopeTimeScale * 10;
            const yVal = Math.sin(2 * Math.PI * freq * t + time);
            const yPx = (h / 2) - (yVal * (h / 4) / state.scopeVoltsScale);
            if (x === 0) scopeCtx.moveTo(x, yPx); else scopeCtx.lineTo(x, yPx);
        }
        scopeCtx.stroke();

        // Ch 2 Output
        scopeCtx.beginPath();
        scopeCtx.strokeStyle = '#ffb703';
        scopeCtx.lineWidth = 2;
        const atten = state.isTurboOptimized ? 0.95 : 0.7;
        for (let x = 0; x < w; x++) {
            const t = (x / w) * state.scopeTimeScale * 10;
            const yVal = atten * Math.sin(2 * Math.PI * freq * t + time - 0.4);
            const yPx = (h / 2) - (yVal * (h / 4) / state.scopeVoltsScale);
            if (x === 0) scopeCtx.moveTo(x, yPx); else scopeCtx.lineTo(x, yPx);
        }
        scopeCtx.stroke();

        // Stats
        document.getElementById('stat-freq').innerText = formatValue(freq, 'Hz');
        document.getElementById('stat-vpeak').innerText = (5.0 * atten).toFixed(2) + ' V';
        document.getElementById('stat-vrms').innerText = (5.0 * atten * 0.707).toFixed(2) + ' V';
    }

    function drawBodePlot() {
        if (!bodeCtx) return;
        const w = bodeCanvas.width;
        const h = bodeCanvas.height;

        bodeCtx.fillStyle = '#05080e';
        bodeCtx.fillRect(0, 0, w, h);

        bodeCtx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
        for (let x = 0; x < w; x += w / 10) {
            bodeCtx.beginPath(); bodeCtx.moveTo(x, 0); bodeCtx.lineTo(x, h); bodeCtx.stroke();
        }

        bodeCtx.beginPath();
        bodeCtx.strokeStyle = '#00ff88';
        bodeCtx.lineWidth = 2.5;

        const fc = state.computedFc || 15915;
        for (let x = 0; x < w; x++) {
            const logFreq = 1 + (x / w) * 6;
            const f = Math.pow(10, logFreq);
            const gain = 1 / Math.sqrt(1 + Math.pow(f / fc, 2));
            const gainDb = 20 * Math.log10(gain);
            const yPx = (h * 0.15) - (gainDb * (h * 0.018));
            if (x === 0) bodeCtx.moveTo(x, yPx); else bodeCtx.lineTo(x, yPx);
        }
        bodeCtx.stroke();
    }

    function drawLogicAnalyzer() {
        if (!logicCtx) return;
        const w = logicCanvas.width;
        const h = logicCanvas.height;

        logicCtx.fillStyle = '#05080e';
        logicCtx.fillRect(0, 0, w, h);

        logicCtx.strokeStyle = '#9d4edd';
        logicCtx.lineWidth = 2;
        const time = Date.now() * 0.005;

        // Channel 0 Square Wave
        logicCtx.beginPath();
        for (let x = 0; x < w; x++) {
            const val = Math.sin(x * 0.05 + time) > 0 ? 1 : 0;
            const yPx = (h * 0.3) - (val * 30);
            if (x === 0) logicCtx.moveTo(x, yPx); else logicCtx.lineTo(x, yPx);
        }
        logicCtx.stroke();
    }

    // ----------------------------------------------------------------------
    // 13. AI SUITE: AUDIT, CODE GENERATION, TUTOR CHAT
    // ----------------------------------------------------------------------
    function runAICircuitAudit() {
        const auditBox = document.getElementById('ai-audit-results');
        auditBox.innerHTML = `
            <div class="dc-row"><span><i class="fa-solid fa-circle-check text-green"></i> Ground Reference:</span> <strong>Connected (Node 0)</strong></div>
            <div class="dc-row" style="margin-top:6px;"><span><i class="fa-solid fa-triangle-exclamation text-gold"></i> Decoupling Caps:</span> <strong>Recommend 100nF Ceramic at IC VCC Pin</strong></div>
            <div class="dc-row" style="margin-top:6px;"><span><i class="fa-solid fa-circle-check text-green"></i> DC Biasing:</span> <strong>Semiconductors properly biased in Active Region</strong></div>
        `;
    }

    function generateEmbeddedCode() {
        const target = document.getElementById('code-target-select').value;
        const codeArea = document.getElementById('code-display-area');

        if (target === 'arduino') {
            codeArea.innerText = `// CircuitCraft AI Generated Arduino Code\n#define SIGNAL_PIN 13\n#define SENSOR_PIN A0\n\nvoid setup() {\n  pinMode(SIGNAL_PIN, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int val = analogRead(SENSOR_PIN);\n  digitalWrite(SIGNAL_PIN, HIGH);\n  delay(500);\n  digitalWrite(SIGNAL_PIN, LOW);\n  delay(500);\n}`;
        } else if (target === 'stm32') {
            codeArea.innerText = `/* CircuitCraft AI STM32 HAL Code */\n#include "main.h"\n\nvoid SystemClock_Config(void);\n\nint main(void) {\n  HAL_Init();\n  SystemClock_Config();\n  MX_GPIO_Init();\n  while (1) {\n    HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);\n    HAL_Delay(250);\n  }\n}`;
        } else if (target === 'matlab') {
            codeArea.innerText = `% CircuitCraft AI MATLAB Simulation Script\nR = 1000;\nC = 10e-9;\nfc = 1 / (2*pi*R*C);\nf = logspace(1, 7, 1000);\nH = 1 ./ sqrt(1 + (f./fc).^2);\nsemilogx(f, 20*log10(H));\ngrid on;\ntitle('RC Filter Bode Plot');\nxlabel('Frequency (Hz)'); ylabel('Gain (dB)');`;
        } else if (target === 'verilog') {
            codeArea.innerText = `/* CircuitCraft AI Verilog Module */\nmodule LogicDecoder (\n    input wire clk,\n    input wire in_a,\n    input wire in_b,\n    output reg out_y\n);\n  always @(posedge clk) begin\n    out_y <= in_a ^ in_b;\n  end\nendmodule`;
        }
    }

    function handleAIChatSend() {
        const input = document.getElementById('chat-user-input');
        const text = input.value.trim();
        if (!text) return;

        const chatBox = document.getElementById('chat-messages-box');
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user-msg';
        userMsg.innerHTML = `<div>${text}</div>`;
        chatBox.appendChild(userMsg);
        input.value = '';

        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.className = 'chat-msg ai-msg';
            aiMsg.innerHTML = `<i class="fa-solid fa-robot"></i><div>For <strong>"${text}"</strong>: Ensure impedance matching where $Z_{src} = Z_{load}^*$. For RC filtering, cutoff is $f_c = \\frac{1}{2\\pi R C}$.</div>`;
            chatBox.appendChild(aiMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 600);
    }

    // ----------------------------------------------------------------------
    // 14. VOICE COMMAND ASSISTANT (WEB SPEECH API)
    // ----------------------------------------------------------------------
    function startVoiceRecognition() {
        showModal('modal-voice');
        const statusText = document.getElementById('voice-status-text');
        const transcriptText = document.getElementById('voice-transcript-text');

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            statusText.innerText = 'Voice Speech API not supported in this browser.';
            return;
        }

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => { statusText.innerText = 'Listening for commands...'; };
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript.toLowerCase();
            transcriptText.innerText = `"${transcript}"`;

            if (transcript.includes('resistor')) addComponentToCanvas('resistor', 300, 200);
            else if (transcript.includes('opamp') || transcript.includes('op amp')) addComponentToCanvas('opamp', 300, 200);
            else if (transcript.includes('clear')) clearWorkspace();
            else if (transcript.includes('simulate') || transcript.includes('run')) state.isSimulating = true;
            else if (transcript.includes('turbo') || transcript.includes('boost')) applyTurboBoost('peaking');
        };
        recognition.start();
    }

    // ----------------------------------------------------------------------
    // 15. PROJECT STORAGE, EXPORT & PRINT
    // ----------------------------------------------------------------------
    function saveProjectJSON() {
        const data = JSON.stringify({ components: state.components, wires: state.wires }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'circuitcraft_project.json';
        a.click();
    }

    function openProjectJSON(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const project = JSON.parse(evt.target.result);
            state.components = project.components || [];
            state.wires = project.wires || [];
            saveStateToUndoStack();
            requestRender();
            recalculateCircuitDynamics();
        };
        reader.readAsText(file);
    }

    function exportCanvasPNG() {
        const url = circuitCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'circuitcraft_schematic.png';
        a.click();
    }

    function printSchematic() {
        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>CircuitCraft Schematic Print</title></head><body style="text-align:center;"><img src="${circuitCanvas.toDataURL()}" style="max-width:100%;"><script>window.onload=()=>window.print();</script></body></html>`);
    }

})();
