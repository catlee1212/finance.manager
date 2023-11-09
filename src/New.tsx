import React, { ChangeEvent, ReactNode } from 'react';

export default class New extends React.Component {

  constructor(props = {}) {
    super(props);
    this.state = {
      budget: { budgetValue: 2200, fiftyPercent: 0, thirtyPercent: 0, twentyPercent: 0 },
      fixedCostRow: [],
      fixedCostValue: 0
    }
  }

  render(): ReactNode {
    return <>
      <div key="{1}"></div>
    </>;
  }
}
