import { Component } from 'react';
import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      linkButtonText: "Link Account",
      addResourcesButtonText: "Add to Linked Account",
      linkErrorText: null,
      addResourcesSuccessText: null,
      addResourcesErrorText: null,
      hasLinkedAccount: false,
      linkedAccountId: null,
      linkedAccountSessionTicket: null
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { linkButtonText, hasLinkedAccount } = this.state;
    if (linkButtonText === "Linking...") return;
    if (hasLinkedAccount) {
      this.setState({ linkButtonText: "Link Account", hasLinkedAccount: false, linkedAccountId: null, linkErrorText: null });
      return;
    }
    this.setState({ linkButtonText: "Linking..." });
    const result = await fetch('https://65cb9.playfabapi.com/Client/LoginWithEmailAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "TitleId": "65cb9", "Email": e.target.email.value, "Password": e.target.password.value })
    });
    const json = await result.json();
    if (result.status === 200) {
      this.setState({ linkButtonText: "Unlink Account", hasLinkedAccount: true, linkedAccountId: json.data.PlayFabId, linkedAccountSessionTicket: json.data.SessionTicket, linkErrorText: null });
    } else {
      this.setState({ linkButtonText: "Link Account", linkErrorText: json.errorMessage });
    }
  };

  handleAddResources = async e => {
    e.preventDefault();
    this.setState({ addResourcesButtonText: "Adding..." });
    const coinNumber = parseInt(e.target.coins.value);
    const gemNumber = parseInt(e.target.gems.value);
    let isAddingCoins = false;
    let isAddingGems = false;
    let newCoins = 0;
    let newGems = 0;
    if (!isNaN(coinNumber) && coinNumber > 0) {
      isAddingCoins = true;
      const result = await fetch('https://65cb9.playfabapi.com/Client/AddUserVirtualCurrency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': this.state.linkedAccountSessionTicket
        },
        body: JSON.stringify({ "TitleId": "65cb9", "PlayFabId": this.state.linkedAccountId, "VirtualCurrency": "CO", "Amount": coinNumber })
      });
      const json = await result.json();
      newCoins = json.data.Balance;
      if (result.status !== 200) {
        this.setState({ addResourcesButtonText: "Add to Linked Account", addResourcesErrorText: json.errorMessage });
        return;
      }
    }
    if (!isNaN(gemNumber) && gemNumber > 0) {
      isAddingGems = true;
      const result = await fetch('https://65cb9.playfabapi.com/Client/AddUserVirtualCurrency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': this.state.linkedAccountSessionTicket
        },
        body: JSON.stringify({ "TitleId": "65cb9", "PlayFabId": this.state.linkedAccountId, "VirtualCurrency": "CR", "Amount": gemNumber })
      });
      const json = await result.json();
      newGems = json.data.Balance;
      if (result.status !== 200) {
        this.setState({ addResourcesButtonText: "Add to Linked Account", addResourcesErrorText: json.errorMessage });
        return;
      }
    }
    let successText = "Successfully added ";
    if (isAddingCoins) successText += `${coinNumber} coins`;
    if (isAddingCoins && isAddingGems) successText += " and ";
    if (isAddingGems) successText += `${gemNumber} gems`;
    successText += " to your account! ";
    if (isAddingCoins) successText += `You now have ${newCoins} coins`;
    if (isAddingCoins && isAddingGems) successText += "and ";
    if (isAddingGems) successText += `${newGems} gems`;
    successText += ".";
    this.setState({ addResourcesButtonText: "Add to Linked Account", addResourcesSuccessText: successText, addResourcesErrorText: null });
  }

  render() {
    const { linkButtonText, addResourcesButtonText, linkErrorText, addResourcesErrorText, addResourcesSuccessText, hasLinkedAccount, linkedAccountId } = this.state;
    return (
      <><div class="m-auto w-3/6 p-14 mt-10 bg-gray-400 text-gray-200 text-center rounded-lg">
        <div class="flex h-full justify-center items-center flex-wrap">
          <div>
            <h1 class="text-4xl w-full font-bold">TDToolsGUI v1</h1>
            <p class="text-xl mt-7 text-gray-100">Free account tools to interact with and exploit <a href="https://tacticalduty.io" target="_blank" rel="noreferrer">TacticalDuty.io</a> servers.</p>
          </div>
        </div>
      </div>
        <div class="m-auto w-3/6 p-14 mt-10 bg-gray-400 text-gray-200 text-center rounded-lg">
          <div class="flex h-full justify-center items-center flex-wrap">
            <div>
              <h1 class="text-4xl w-full font-bold">Disclaimer</h1>
              <p class="text-xl mt-7 text-gray-100">These tools are meant for educational use only! We bear no responsibility for any bans or limits that may be imposed on your account by the TacticalDuty.io developers as a result of abuse of our provided services.</p>
            </div>
          </div>
        </div><div class="m-auto w-3/6 p-14 mt-10 bg-gray-400 text-gray-200 text-center rounded-lg">
          <div class="flex h-full justify-center items-center flex-wrap">
            <div class="w-full">
              <h1 class="text-4xl w-full font-bold">Link your Account</h1>
              <p class="text-xl mt-7 text-gray-100">Emails and passwords are never stored.</p>
              <div class={`text-xl mt-10 text-white ${hasLinkedAccount ? "bg-success" : "bg-error"} p-5 rounded-lg w-full`}>STATUS: {hasLinkedAccount ? `Connected (${linkedAccountId})` : "Disconnected"}</div>
              <form class="mt-10" onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email" class="pr-5 w-full inline-block text-left mb-5">Email</label><br></br>
                  <input class={`inline-block text-left text-gray-100 bg-gray-500 w-full ${hasLinkedAccount ? "disabled-input" : null}`} type="email" name="email" required readonly={hasLinkedAccount ? 'true' : undefined} />
                </div>
                <div className="input-group">
                  <label htmlFor="password" class="pr-5 w-full inline-block text-left mb-5 mt-7">Password</label><br></br>
                  <input class={`inline-block text-left text-gray-100 bg-gray-500 w-full ${hasLinkedAccount ? "disabled-input" : null}`} type="password" name="password" required readonly={hasLinkedAccount ? 'true' : undefined} />
                </div>
                {linkErrorText !== null ? <p class="text-xl mt-7 text-left text-error">{linkErrorText}</p> : null}
                <button class="mt-11 text-xl text-white bg-primary p-5 rounded-lg w-full">{linkButtonText}</button>
              </form>
            </div>
          </div>
        </div>
        <div class="m-auto w-3/6 p-14 mt-10 mb-10 bg-gray-400 text-gray-200 text-center rounded-lg">
          <div class="flex h-full justify-center items-center flex-wrap">
            <div class="w-full">
              <h1 class="text-4xl w-full font-bold">Add Resources</h1>
              {hasLinkedAccount
                ? (<><p class="text-xl mt-7 text-gray-100">Add any amount of coins and/or gems to your account!</p>
                  <form class="mt-10" onSubmit={this.handleAddResources}>
                    <div className="input-group">
                      <label htmlFor="coins" class="pr-5 w-full inline-block text-left mb-5">Coins</label><br></br>
                      <input class="inline-block text-left text-gray-100 bg-gray-500 w-full" type="number" min='0' max='100000' name="coins" />
                    </div>
                    <div className="input-group">
                      <label htmlFor="gems" class="pr-5 w-full inline-block text-left mb-5 mt-7">Gems</label><br></br>
                      <input class="inline-block text-left text-gray-100 bg-gray-500 w-full" type="number" min='0' max='100000' name="gems" />
                    </div>
                    {addResourcesSuccessText !== null ? <p class="text-xl mt-7 text-left text-success">{addResourcesSuccessText}</p> : null}
                    {addResourcesErrorText !== null ? <p class="text-xl mt-7 text-left text-error">{addResourcesErrorText}</p> : null}
                    <button class="mt-11 text-xl text-white bg-gray-300 p-5 rounded-lg w-full">{addResourcesButtonText}</button>
                  </form></>)
                : <p class="text-xl mt-7 text-gray-100">You must first link your account above before you can add resources.</p>
              }
            </div>
          </div>
        </div></>
    )
  }
}