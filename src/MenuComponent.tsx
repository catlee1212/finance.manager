import React, { ReactNode } from "react";
import { fixedCostSymbol, ruleSymbol } from "./ScreenSymbols";


interface MenuComponentProps {
  setValueInParent(screenId: string): void;
}

export default class MenuComponent extends React.Component<MenuComponentProps> {

  render(): ReactNode {
    return <>
      <div className="topNavigation">
        <nav>
          <ul>
            <li onClick={this.onMenuItemClicked.bind(this, ruleSymbol)}>Budgeting rule</li>
            <li onClick={this.onMenuItemClicked.bind(this, fixedCostSymbol)}>Fixed cost calculator</li>
          </ul>
        </nav>
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