# Reactive programming

Reactive programming is concenered with handling change, specifically, the _propagation of change_. As web applications have become more and more asynchronous, keeping track of application state has become increasingly complex. With traditional programming patterns, we rely on event listeners or try to keep track of application state manually.

Consider a banking application where the user's account balance might appear in several different places on the screen. After the user makes a withdrawl, we want the account balance to update.

## Imperative approach

Traditionally, we might use an event emitter. Every time the balance is updated we emit an event, and any interested parties can listen for these events.

![Banking](resources/imperative.png)

```javascript
// assume some sort of application wide MessageBus

function makeWithdrawl() {
    // make the withdrawl
    messageBus.emit('account-balance-updated', newBalance);
}

// at different points in the UI
messageBus.on('account-balance-updated', (newBalance) => {
    accountDomElement.innerText = newBalance;
});
```

With an event emitter, any interested widget can listen for updates to the account balance.  This pattern has served well in the past, but there are a few problems with this approach:

*   We need to remember to emit `account-balance-updated` every time the account balance is changed.
*   We need to rememer to listen for balance updates.
*   We need to have a facitlity to **remove** the event listeners when they are no longer needed.

## Reactive approach

Dojo 2 is built around unidirectional, top-down property propagation It is the parent widget's job to pass properties down to its children. In fact, a child widget has no direct reference a parent widget! When a property changes, widgets are re-rendered (using an efficient virtual DOM) to reflect the updated state. 

In our banking example, we simply provide the account balance as a property to the widget, and when the property changes, so does our user interface. The account balance is propagated down to the widgets that need it.

![Account Balance](resources/dojo2-reactive.png)

```typescript
export interface AccountBalanceProperties extends WidgetProperties {
    balance: number;
}

class AccountBalance extends WidgetBase<AccountBalanceProperties> {
    render() {
      	const { balance } = this.properties;
        return v('span', {}, [ balance ]);
    }
}
```

Our `AccountBalance` widget is only concerned with its `balance` property, and that property is provided by the parent widget.  Setting the balance property at the application level will cause the balance to be updated across the entire application.

## What's next?

Reactive programming patterns are being used in Dojo 2 to make widgets consistent and easy to author.  In fact to further embrace reactive patterns, with beta 3, Dojo 2 will have a reactive application store. Want to learn more about reactive programming? There are a number of additional reactive patterns that can be used to manage your application state (like [Redux](http://redux.js.org/), or [Observables](http://reactivex.io/documentation/observable.html)).
