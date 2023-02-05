import { FaToolbox, FaArrowCircleDown } from 'react-icons/fa';
import { Component } from 'react';

const Sidebar = ({ setActiveTab, currentActiveTab }) => {
    return (
        <div className="fixed top-0 left-0 h-screen w-20 m-0 bg-gray-400 flex flex-col shadow-lg">
            <SidebarIcon icon={<FaToolbox size="28" />} text="Toolbox" first tabName="Toolbox" setActiveTab={setActiveTab} isCurrent={currentActiveTab === "Toolbox"} />
            <SidebarIcon icon={<FaArrowCircleDown size="28" />} text="Downloads" tabName="TDModdedInfo" setActiveTab={setActiveTab} isCurrent={currentActiveTab === "TDModdedInfo"} />
        </div>
    );
}

class SidebarIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: props.icon,
            first: props.first,
            text: props.text,
            tabName: props.tabName,
            setActiveTab: props.setActiveTab,
            isCurrent: props.isCurrent
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isCurrent !== this.props.isCurrent) {
            this.setState({ isCurrent: this.props.isCurrent });
        }
    };

    render() {
        const { tabName, setActiveTab, isCurrent } = this.state;
        console.log(isCurrent);
        return (
            <div className={`${this.state.isCurrent ? "sidebar-icon-selected" : "sidebar-icon"} ${this.state.first ? "mt-4" : null} group`} onClick={() => setActiveTab(tabName)}>
                {this.state.icon}
                <span className="sidebar-tooltip group-hover:scale-100">
                    {this.state.text}
                </span>
            </div>
        );
    }
}

export default Sidebar;