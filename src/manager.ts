//your code goes here!

// These import statements are suggestions on how to get your three main libraries into this code.
// You'll need to create each of these libraries.
import {Members} from './members';
import {Gatherings} from './gatherings';
import {Organizations} from './organizations';

export class GatheringManager {

    constructor() {
    }

    addMember(name: string, email: string) {
    }

    addGathering(title: string, location: string, date: string) {
    }

    addOrganization(title: string) {
    }

    addMemberToGathering(name: string, gatheringTitle: string) {
    }

    addGatheringToOrganization(gatheringTitle: string, organizationTitle: string) {
    }

    modifyGathering(title: string, newTitle: string, newDate?: string) {
    }

    getMembers(gatheringTitle: string): string[] {
    }

    findMemberNames(query: string): string[] {
    }

    findGatheringNames(query: string): string[] {
    }

    findOrganizationNames(query: string): string[] {
    }
}
