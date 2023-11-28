import React, { ReactNode } from 'react';
import RowComponent from './RowComponent';
import { PieChart } from './PieChart';

interface BudgetProps {
  earningsPerMonth: number;
}

interface BudgetingState {
  earningsPerMonth: number;
  fixedCostRow: any[];
  rowValues: { idx: number, expense: number, checkBoxFlag: boolean }[];
  blur: string;
}

interface BudgetLeft {
  sumExpenses: number;
  budgetLeft: number;
}

export default class BudgetingFixedExpensesComponent extends React.Component<BudgetProps, BudgetingState> {

  constructor(props: BudgetProps) {
    super(props);
    this.state = {
      earningsPerMonth: this.props.earningsPerMonth,
      fixedCostRow: [<RowComponent key={0} idx={0} setValueInParent={this.arrayOfChangedValues.bind(this)} />],
      rowValues: [{ idx: 0, expense: 0, checkBoxFlag: false }],
      blur: 'blur'
    }
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.onScrolled.bind(this), true);
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScrolled.bind(this), true);
  }

  render(): ReactNode {
    return <>
      <div className="row">
        <div className="container halfRowWrapper">
          <div className="fixed halfRowSecond halfRow">
            <div className="inner">
              <PieChart data={[
                { usage: 'Montly earnings', amount: this.props.earningsPerMonth, color: 'rgba(101,101,101,0.4)' },
                { usage: 'Fixed costs', amount: calculateBudgetByExpenses(this.state.rowValues, this.props.earningsPerMonth).sumExpenses, color: 'rgba(219,98,111,0.6)' },
                { usage: 'Remaining budget', amount: calculateBudgetByExpenses(this.state.rowValues, this.props.earningsPerMonth).budgetLeft, color: 'rgba(97,180,86,0.4)' }
              ]}
                width={300}
                height={300}
              />
            </div>
          </div>
          <div className={`scrollable halfRowFirst halfRow ${this.state.blur}`}>
            <h1>Budgeting your fixed expenses</h1>
            <p>Earnings: {this.props.earningsPerMonth} € | Fixed costs: {calculateBudgetByExpenses(this.state.rowValues, this.props.earningsPerMonth).sumExpenses} € | Remaining budget: {calculateBudgetByExpenses(this.state.rowValues, this.props.earningsPerMonth).budgetLeft} €</p>
            {this.state.fixedCostRow}
            <div className="buttonHandler">
              <button className="mainButton" onClick={this.onAddRowButtonClicked.bind(this)}>add row</button>
            </div>
            <h2>How does it work?</h2>
            <p>So what exactly are your monthly expeses? Calculate your budget here.</p>
            <p>To substract your fixed costs from your monthly earnings, please check checkbox on the left side of the input field. Otherwise amout will be ignored.</p>
            <p>If you want to see how one amount influences your budget just check or uncheck it.</p>
            <p>If you want to add another row of fixed costs, just click the "add row" button.</p>
            <div>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  onAddRowButtonClicked(): void {
    let rowToAdd = <RowComponent key={this.state.fixedCostRow.length + 1} idx={this.state.fixedCostRow.length + 1} setValueInParent={this.arrayOfChangedValues.bind(this)} />;
    this.setState({ fixedCostRow: [...this.state.fixedCostRow, rowToAdd] });
  }

  arrayOfChangedValues(idx: number, expense: number, checkBoxFlag: boolean): void {
    let newArray = { idx, expense, checkBoxFlag };
    let oldArray = this.state.rowValues;
    let expensesArray = replaceOrAdd(oldArray, newArray);
    this.setState({ rowValues: expensesArray });
  }

  onScrolled(): void {
    this.setState({ blur: '' });
  }

}

function calculateBudgetByExpenses(fixedCost: { idx: number, expense: number, checkBoxFlag: boolean }[], budget: number): BudgetLeft {
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