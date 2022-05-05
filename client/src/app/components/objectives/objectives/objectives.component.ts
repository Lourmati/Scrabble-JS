import { Component } from '@angular/core';
import { Objective } from '@app/classes/objective/objective';
import { ObjectivesControllerService } from '@app/services/objectives/objectives-controller.service';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent {
    publicObjectives: Objective[];
    privateObjective: Objective;
    constructor(private readonly objectivesService: ObjectivesControllerService) {
        this.objectivesService.getPublicObjectives().subscribe(this.handlePublicObjectivesUpdate.bind(this));
        this.objectivesService.getPrivateObjectives().subscribe(this.handlePrivateObjectivesUpdate.bind(this));
    }
    handlePublicObjectivesUpdate(publicObjectives: Objective[]) {
        this.publicObjectives = [...publicObjectives];
    }
    handlePrivateObjectivesUpdate(privateObjectives: Objective) {
        this.privateObjective = privateObjectives;
    }
}
