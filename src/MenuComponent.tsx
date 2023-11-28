import React, { ReactNode } from "react";
import { fixedCostSymbol, ruleSymbol } from "./ScreenSymbols";


interface MenuComponentProps {
  setValueInParent(screenId: string): void;
}

export default class MenuComponent extends React.Component<MenuComponentProps> {

  render(): ReactNode {
    return <>
      <div className="navigation" role="navigation" aria-label="Main Navigation">
        <div id="prevImage" onClick={this.onMenuItemClicked.bind(this, ruleSymbol)}>
          <div className="arrowWrapper">
            <div className="arrowIcon"></div>
            <div className="arrowIcon"></div>
          </div>
        </div>
        <div id="nextImage" onClick={this.onMenuItemClicked.bind(this, fixedCostSymbol)}>
          <div className="arrowWrapper">
            <div className="arrowIcon"></div>
            <div className="arrowIcon"></div>
          </div>
        </div>
      </div>
    </>;
  }

  onMenuItemClicked(screenId: string): void {
    setScreenID(this.props, screenId);
  }

}

function setScreenID(props: MenuComponentProps, screenId: string): void {
  if (props.setValueInParent !== undefined) props.setValueInParent(screenId);
}