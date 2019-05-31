function PopupController() {
    this.tabs = [];
}

PopupController.prototype.init = function() {
    let self = this;
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.type === MessageType.CONFIGURATION_RESPONSE) {
            self.handleConfigResponse(request.config)
        }
    });
    chrome.tabs.query({}, function(tabs) {
        self.tabs = tabs;
        Messaging.sendConfigurationRequest();
    });
};

PopupController.prototype.handleConfigResponse = function(config) {
    this.render(config);
};

PopupController.prototype.render = function(configuration) {
    this.renderTable(this.tabs, configuration.selectedTabs);
    this.renderButtons(configuration.enabled);
    this.renderStrategySelect(configuration.availableStrategies, configuration.activeStrategy);
};

PopupController.prototype.renderTable = function(tabs, selectedTabs) {
    let tabTable = document.getElementById("tabTable");
    tabs.forEach(function(tab) {
        let tr = document.createElement("tr");
        let tabName = document.createElement("td");
        let selectTab = document.createElement("td");

        tr.className = "tabRow";

        tabName.className = "tabNameCol";
        tabName.innerText = tab.title;

        selectTab.className = "tabMuteCol";
        let tabCheckbox = document.createElement("input");
        tabCheckbox.type = "checkbox";
        tabCheckbox.checked = selectedTabs.includes(tab.id);
        tabCheckbox.addEventListener( 'change', function() {
            if(this.checked) {
                Messaging.sendAddSelectedTab(tab.id);
            } else {
                Messaging.sendRemoveSelectedTab(tab.id);
            }
        });
        selectTab.appendChild(tabCheckbox);

        tr.appendChild(tabName);
        tr.appendChild(selectTab);

        tabTable.appendChild(tr);
    });
};

PopupController.prototype.renderButtons = function(enabled) {
    let toggleButton = document.getElementById("toggleOnOff");
    toggleButton.innerText = enabled ? "Off" : "On";
    toggleButton.onclick = function() {
        enabled = !enabled;
        Messaging.sendEnableDisable(enabled);
        toggleButton.innerText = enabled ? "Off" : "On";
    };
};

PopupController.prototype.renderStrategySelect = function(availableStrategies, activeStrategy) {
    let strategySelect = document.getElementById("strategySelect");
    availableStrategies.forEach(strategy => {
        let option = document.createElement("option");
        option.innerText = strategy.name;
        option.selected = strategy.name === activeStrategy.name;
        strategySelect.add(option);
    });

    strategySelect.onchange = function() {
        Messaging.sendStrategySelect(this.options[this.selectedIndex].text);
    };
};

const popupController = new PopupController();
popupController.init();
