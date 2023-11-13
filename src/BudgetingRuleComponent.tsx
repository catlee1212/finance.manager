import React, { ChangeEvent, ReactNode } from 'react';
import { PieChart } from './PieChart';
import { defaultBudgetValue, defaultFiftyPercent, defaultThirtyPercent, defaultTwentyPercent } from './DefaultValues';

interface Budget {
  budgetValue: number;
  fiftyPercent: number;
  thirtyPercent: number;
  twentyPercent: number;
}

interface BudgetingState {
  budget: Budget;
}

interface BudgetingRuleProps {
  setValueInParent(earningsPerMonth: number): void;
}

export default class BudgetingRuleComponent extends React.Component<BudgetingRuleProps, BudgetingState> {

  constructor(props: BudgetingRuleProps) {
    super(props);
    this.state = {
      budget: { budgetValue: defaultBudgetValue, fiftyPercent: defaultFiftyPercent, thirtyPercent: defaultThirtyPercent, twentyPercent: defaultTwentyPercent },
    }
  }

  render(): ReactNode {
    return <>
      <div className="row">
        <div className="halfRowWrapper container">
          <div className="halfRow">
            <h1>Budgeting with the 50-30-20 rule</h1>
            <p>Calculate your expenses and savings by using <strong>50-30-20</strong> rule.</p>
            <p><strong> 50 %</strong> of your budget should go into your <strong>fixed costs</strong> e.g. rent, electricity, gas, monthly bills, insurance etc.</p>
            <p><strong> 30 %</strong> into your <strong>wishes and fun</strong> e.g. vacation, gym membershit, entertainment, amazon, restaurant, concerts.</p>
            <p><strong>20 %</strong> should go into your <strong>savings</strong>.</p>
            <input className="earning" type="number" placeholder="Your monthly earnings" onChange={this.onBudgetChanged.bind(this)}></input>
            <div className="infoNote">Average is calculated with {defaultBudgetValue} €</div>
          </div>
          <div className="halfRow">
            <PieChart data={[
              { usage: 'Fifty percent - fixed costs', amount: this.state.budget.fiftyPercent, color: '#959595' },
              { usage: 'Thirty percent - wishes and fun', amount: this.state.budget.thirtyPercent, color: '#c0c0c0' },
              { usage: 'Twenty percent - savings', amount: this.state.budget.twentyPercent, color: '#d5d5d5' }
            ]}
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </>;
  }

  onBudgetChanged(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({ budget: calculateBudgetByRule(event) });
    let earningsPerMonth = parseInt(event.target.value);
    setEarningsPerMonthValueInParent(this.props, earningsPerMonth);
  }

}

function calculateBudgetByRule(event: ChangeEvent<HTMLInputElement>): Budget {
  const budgetValue = parseInt(event.target.value);
  const fiftyPercent = parseInt((budgetValue * 0.5).toFixed(2));
  const thirtyPercent = parseInt((budgetValue * 0.3).toFixed(2));
  const twentyPercent = parseInt((budgetValue * 0.2).toFixed(2));

  if (Number.isNaN(budgetValue)) {
    return {
      budgetValue: 100,
      fiftyPercent: 10,
      thirtyPercent: 30,
      twentyPercent: 20
    };
  }

  return {
    budgetValue: budgetValue,
    fiftyPercent: fiftyPercent,
    thirtyPercent: thirtyPercent,
    twentyPercent: twentyPercent
  };
}

function setEarningsPerMonthValueInParent(props: BudgetingRuleProps, earningsPerMonth: number): void {
  if (Number.isNaN(earningsPerMonth)) {
    earningsPerMonth = 0;
  }
  if (props.setValueInParent !== undefined) props.setValueInParent(earningsPerMonth);
}