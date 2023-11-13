import React, { ReactNode } from "react";
import BudgetingFixedExpensesComponent from "./BudgetingFixedExpensesComponent";
import BudgetingRuleComponent from "./BudgetingRuleComponent";

interface MainState {
  earningsPerMonth: number
}

export default class MainComponent extends React.Component<Record<string, never>, MainState> {

  constructor(props = {}) {
    super(props);
    this.state = {
      earningsPerMonth: 2200
    }
  }

  render(): ReactNode {
    return <>
      <div className="outerContainer">
        <BudgetingRuleComponent setValueInParent={this.setValueInParent.bind(this)} />
        <BudgetingFixedExpensesComponent earningsPerMonth={this.state.earningsPerMonth} />
      </div>
    </>;
  }

  setValueInParent(earningsPerMonth: number): void {
    this.setState({ earningsPerMonth: earningsPerMonth });
  }

}


