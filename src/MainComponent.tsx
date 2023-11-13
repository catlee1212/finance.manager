import React, { ReactNode } from "react";
import BudgetingFixedExpensesComponent from "./BudgetingFixedExpensesComponent";
import BudgetingRuleComponent from "./BudgetingRuleComponent";
import MenuComponent from "./MenuComponent";
import { fixedCostSymbol, ruleSymbol } from "./ScreenSymbols";
import { defaultBudgetValue } from "./DefaultValues";

interface MainState {
  earningsPerMonth: number
  selectedScreen: string
}

export default class MainComponent extends React.Component<Record<string, never>, MainState> {

  constructor(props = {}) {
    super(props);
    this.state = {
      earningsPerMonth: defaultBudgetValue,
      selectedScreen: ruleSymbol
    }
  }

  render(): ReactNode {

    let componentToShow = <></>;
    switch (this.state.selectedScreen) {
      case ruleSymbol:
        componentToShow = <BudgetingRuleComponent setValueInParent={this.setEarningsValueInParent.bind(this)} />;
        break;
      case fixedCostSymbol:
        componentToShow = <BudgetingFixedExpensesComponent earningsPerMonth={this.state.earningsPerMonth} />;
        break;
      default: throw new Error('Unknown Screen');
    }

    return <>
      <MenuComponent setValueInParent={this.setScreenIdInParent.bind(this)} />
      <div className="outerContainer">
        {componentToShow}
      </div>
    </>;
  }

  setEarningsValueInParent(earningsPerMonth: number): void {
    this.setState({ earningsPerMonth: earningsPerMonth });
  }

  setScreenIdInParent(screenId: string): void {
    this.setState({ selectedScreen: screenId });
  }
}
