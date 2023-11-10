import React, { ChangeEvent, ReactNode } from 'react';
import RowComponent from './RowComponent';
import { PieChart } from './PieChart';

export interface Budget {
  budgetValue: number;
  fiftyPercent: number;
  thirtyPercent: number;
  twentyPercent: number;
}

export interface BudgetingState {
  budget: Budget;
  fixedCostRow: any[];
  rowValues: { idx: number, expense: number, checkBoxFlag: boolean }[];
  flagCheckbox: boolean;
}

export interface BudgetLeft {
  sumExpenses: number;
  budgetLeft: number;
}

export interface Expenses {
  idx: number;
  expense: number;
  checkBoxFlag: boolean;
}

export default class BudgetingComponent extends React.Component<Record<string, never>, BudgetingState> {

  constructor(props = {}) {

    super(props);
    this.state = {
      budget: { budgetValue: 2200, fiftyPercent: 1100, thirtyPercent: 660, twentyPercent: 440 },
      fixedCostRow: [<RowComponent key={0} idx={0} setValueInParent={this.arrayOfChangedValues.bind(this)} />],
      rowValues: [{ idx: 0, expense: 0, checkBoxFlag: false }],
      flagCheckbox: false
    }

  }

  render(): ReactNode {
    return <>
      <div className="outerContainer">
        <div className="row">
          <div className="halfRowWrapper container">
            <div className="halfRow">
              <h1>Budgeting with the 50-30-20 rule</h1>
              <p>Calculate your expenses and saving by using <strong>50-30-20</strong> rule.
                <strong> 50 %</strong> of your budget should go into your <strong>fixed costs</strong> e.g. rent, electricity, gas, monthly bills, insurance etc.
                <strong> 30 %</strong> into your <strong>wishes and fun</strong> e.g. vacation, gym membershit, entertainment, amazon, restaurant, concerts.
                And <strong>20 %</strong> should go into your <strong>savings</strong>.</p>
              <input className="earning" type="number" placeholder="Your monthly earnings" onChange={this.onBudgetChanged.bind(this)}></input>
              <div className="infoNote">Average is calculated with 2200 €</div>
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
        <div className="container">

        </div>
        <div className="row">
          <div className="halfRowWrapper container">
            <div className="halfRow">
              <h1>Budgeting your fixed expenses</h1>
              <p>So what exactly are your monthly expeses? What is left and how you can handle this.</p> <p>Earnings: {this.state.budget.budgetValue} €</p>

              <p>Fixed costs: {calculateBudget(this.state.rowValues, this.state.budget.budgetValue).sumExpenses} €</p>
              <p>Remaining budget: {calculateBudget(this.state.rowValues, this.state.budget.budgetValue).budgetLeft} €</p>
            </div>
            <div className="halfRow">
              <PieChart data={[
                { usage: 'Montly earnings', amount: this.state.budget.budgetValue, color: 'rgba(101,101,101,0.4)' },
                { usage: 'Fixed costs', amount: calculateBudget(this.state.rowValues, this.state.budget.budgetValue).sumExpenses, color: 'rgba(219,98,111,0.6)' },
                { usage: 'Remaining budget', amount: calculateBudget(this.state.rowValues, this.state.budget.budgetValue).budgetLeft, color: 'rgba(97,180,86,0.4)' }
              ]}
                width={300}
                height={300}
              />
              <p>To substract your fixed costs, please check checkbox. Otherwise amout will be ignored.</p>
              {this.state.fixedCostRow}
              <div className="buttonHandler">
                <button className="mainButton" onClick={this.onAddButtonClicked.bind(this)}>add row</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  onBudgetChanged(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({ budget: calculateBudgetByRule(event) });
  }

  onAddButtonClicked(): void {
    let rowToAdd = <RowComponent key={this.state.fixedCostRow.length + 1} idx={this.state.fixedCostRow.length + 1} setValueInParent={this.arrayOfChangedValues.bind(this)} />;
    this.setState({ fixedCostRow: [...this.state.fixedCostRow, rowToAdd] });
  }

  arrayOfChangedValues(idx: number, expense: number, checkBoxFlag: boolean): void {
    let newArray = { idx, expense, checkBoxFlag };
    let oldArray = this.state.rowValues;
    let expensesArray = replaceOrAdd(oldArray, newArray);
    this.setState({ rowValues: expensesArray });
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

function calculateBudget(fixedCost: { idx: number, expense: number, checkBoxFlag: boolean }[], budget: number): BudgetLeft {
  let sumExpenses = 0;
  let arrayToSumUp: { idx: number, expense: number, checkBoxFlag: boolean }[] = [];
  let budgetLeft = 0;

  fixedCost.forEach((costs) => {
    if (costs.checkBoxFlag === true) arrayToSumUp.push(costs)
  })

  for (let i = 0; i < arrayToSumUp.length; i++) {
    sumExpenses += arrayToSumUp[i].expense;
  }

  budgetLeft = budget - sumExpenses;
  return {
    sumExpenses: sumExpenses,
    budgetLeft: budgetLeft
  };
}

function replaceOrAdd(arrayOfExpenses: Array<{ idx: number, expense: number, checkBoxFlag: boolean }>, newExpenseObject: { idx: number, expense: number, checkBoxFlag: boolean }) {
  let flag = false;
  let newExpenseSingleArray = newExpenseObject;

  // [1] using map for replacing
  let myArray = arrayOfExpenses.map(function (oldExpenseSingleArray) {
    if (oldExpenseSingleArray.idx === newExpenseSingleArray.idx) {
      flag = true;
      return newExpenseSingleArray;
    }
    return oldExpenseSingleArray;
  });

  // [2] if there is nothing to replace: add newObject
  if (!flag) myArray.push(newExpenseSingleArray);
  return myArray;

}