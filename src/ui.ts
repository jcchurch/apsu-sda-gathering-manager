//User Interface for The Gathering Manager
//Code adapted from Joel Ross at the University of Wisconsin
//@author James Church

import readlineSync = require('readline-sync'); //for easier repeated prompts
import {GatheringManager} from './manager';

/**
 * Function to run the UI
 */
export function start() {
  showMainMenu(new GatheringManager());
}

/**
 * The main menu. Will show until the user exits
 */
function showMainMenu(em:GatheringManager) {
  while(true){ //run until we exit
    console.log(`Welcome to the Gathering Manager! Pick an option:
  1. Register a new member
  2. Register a new gathering
  3. Register a new organization
  4. Add a member to a gathering
  5. Modify a gathering
  6. Add a gathering to an organization
  7. List gathering members
  8. Exit`);

    let response = readlineSync.question('> ')
    if(response === '8' || response.slice(0,2).toLowerCase() === ':q'){
      break; //stop looping, thus leaving method
    }

    switch(response) { //handle each response
      case '1': showNewMemberMenu(em); break;
      case '2': showNewGatheringMenu(em); break;
      case '3': showNewOrganizationMenu(em); break;
      case '4': showAddToGatheringMenu(em); break;
      case '5': showModifyGatheringMenu(em); break;
      case '6': showAddToOrganizationMenu(em); break;
      case '7': showListGatheringMembersMenu(em); break;
      //case 8 handled above
      default: console.log('Invalid option!');
    }
    console.log(''); //extra empty line for revisiting
  }
}

/**
 * Show menu to add a new member
 */
function showNewMemberMenu(em:GatheringManager) {
  console.log('Add a new member.');
  let name:string = readlineSync.question('  Name: ');
  let email:string = readlineSync.question('  Email: ');

  em.addMember(name, email);

  console.log('User added!');
}

/** 
 * Show menu to add a new gathering. Will then show menu to add members to the gathering
 */
function showNewGatheringMenu(em:GatheringManager) {
  console.log('Add a new gathering.');
  let gatheringName:string = readlineSync.question('  Title of gathering: ');
  let zipcode:string = readlineSync.question('  Location (zip code): ');
  let date:string = readlineSync.question('  Date and time (ex: Jan 21 2017 13:00 PST): ');

  em.addGathering(gatheringName, zipcode, date);

  showAddToGatheringMenu(em, gatheringName); //add users to new gathering
}

/**
 * Show menu to add a new organization. Will then show menu to add gatherings to the organization
 */
function showNewOrganizationMenu(em:GatheringManager) {
  console.log('Add a new organization.');
  let organizationName:string = readlineSync.question('  Title of organization: ');

  em.addOrganization(organizationName);

  let adding = readlineSync.question('Add gatherings to organization? (y/n): ');
  while(adding.toLowerCase().startsWith('y')){ //while adding members    
    showAddToOrganizationMenu(em, organizationName); //add gatherings to new organization
    adding = readlineSync.question('Add another gathering? (y/n): ');
  }
}

/**
 * Show menu to add a member to a gathering. Will repeat to add multiple members. Will show menu to search for a gathering if none is provided.
 */
function showAddToGatheringMenu(em:GatheringManager, gatheringName?:string) {
  if(!gatheringName){
    gatheringName = showSearchGatheringsMenu(em);
    if(!gatheringName){ return }//if didn't select a gathering
  }

  let adding = readlineSync.question('Add a member to gathering? (y/n): ');
  while(adding.toLowerCase().startsWith('y')){ //while adding members    
    let memberName = showSearchMembersMenu(em); //find a member
    if(memberName){ //if selected someone
      em.addMemberToGathering(memberName, gatheringName);
    } else {
      console.log('No member selected.')
    }
    adding = readlineSync.question('Add another member? (y/n): ');
  }
}

/**
 * Show menu to look up a member. Will return undefined if no member selected.
 */
function showSearchMembersMenu(em:GatheringManager) : string|undefined {
  let query:string = _promptForQuery('member');
  return _searchListMenu('member', em.findMemberNames(query));
}

/**
 * Show menu to look up a gathering. Will return undefined if no gathering selected.
 */
function showSearchGatheringsMenu(em:GatheringManager) : string|undefined {
  let query:string = _promptForQuery('gathering');
  return _searchListMenu('gathering', em.findGatheringNames(query));
}

/**
 * Show menu to look up a organization. Will return undefined if no organization selected.
 */
function showSearchOrganizationsMenu(em:GatheringManager) : string|undefined {
  let query:string = _promptForQuery('organization');
  return _searchListMenu('organization', em.findOrganizationNames(query));
}

/**
 * Helper function that prompts the user for a query.
 */
function _promptForQuery(type: string): string {
  console.log(`Searching for a ${type}.`)
  return readlineSync.question('Search query: ');
}

/**
 * Helper function that shows a menu to search a list of items and choose a result.
 * Will return undefiend if no item is selected
 */
function _searchListMenu(type:string, results:string[]) : string|undefined {
  if(results.length > 0) {
    console.log('Results found: ');
    let resultsDisplay = '  '+(results.map((item:string, idx:number) => `${idx+1}. ${item}`).join('\n  '));
    console.log(resultsDisplay);
    
    let choiceIdx = parseInt(readlineSync.question(`Choose a ${type} (1-${results.length}): `)); //will covert to number or NaN

    return results[choiceIdx-1]; //will return undefined if invalid index
  } else {
    console.log('No results found.')
    return undefined;
  }
}

/**
 * Show menu to modify gathering (title, time, or organization). Will show menu to search for a gathering if none is provided.
 */
function showModifyGatheringMenu(em:GatheringManager, gatheringName?:string) {
  if(!gatheringName){
    gatheringName = showSearchGatheringsMenu(em);
    if(!gatheringName){ return }//if didn't select a gathering
  }

  while(true){ //run until we exit
    console.log(`Edit gathering '${gatheringName}'.
  1. Change title
  2. Change time
  3. Add to organization
  4. Return to previous menu`);

    let response:number = parseInt(readlineSync.question('> '));
    if(response == 1){
      let newTitle = readlineSync.question('  New title: ');
      em.modifyGathering(gatheringName, newTitle);
    }
    else if(response == 2){
      let newTime = readlineSync.question('  New date and time (ex: Jan 21 2017 13:00 PST): ');
      em.modifyGathering(gatheringName, undefined, newTime); //no name to change
    }
    else if(response == 3){
      showAddToOrganizationMenu(em, undefined, gatheringName);
    }
    else if(response == 4){ break; //exit from loop to return
    } else {
      console.log('Invalid option!');
    }
  }
}

/**
 * Show menu to add a gathering to a organization. Will show menus to search for a gathering and a organization if either is not provided.
 */
function showAddToOrganizationMenu(em:GatheringManager, organizationName?:string, gatheringName?:string, ) {
  if(!gatheringName){ //if gathering not yet specified
    gatheringName = showSearchGatheringsMenu(em);
    if(!gatheringName){ return }//if didn't select a gathering
  }

  if(!organizationName){ //if organization not yet specified
    organizationName = showSearchOrganizationsMenu(em);
    if(!organizationName){ return }//if didn't select a organization
  }

  //add the gathering to the organization
  em.addGatheringToOrganization(gatheringName, organizationName);
}

/**
 * Show a list of members participating in a gathering. Will show menu to search for a gathering. Should include outputting member's email addresses.
 */
function showListGatheringMembersMenu(em:GatheringManager) {
  let gatheringName = showSearchGatheringsMenu(em);

  let members = em.getMembers(gatheringName);

  console.log('Members participating in this action:')
  console.log('  '+members.join('\n  ')+'\n');

  readlineSync.keyInPause('(Press any letter to continue)', {guide:false}); //so have time to read stuff
}
