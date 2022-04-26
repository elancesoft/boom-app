import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// import { HomeComponent } from "./home/home.component";
import { EsignComponent } from "./esign/esign.component";
import { RetrieveComponent } from "./retrieve/retrieve.component";
import { StepTwoComponent } from "./step-two/step-two.component";
// import { StepThreeComponent } from "./step-three/step-three.component";
// import { StepFourComponent } from "./step-four/step-four.component";
// import { StepFiveComponent } from "./step-five/step-five.component";
import { StepSixComponent } from "./step-six/step-six.component";
// import { StepSevenComponent } from "./step-seven/step-seven.component";
// import { StepEightComponent } from "./step-eight/step-eight.component";
// import { StepNineComponent } from "./step-nine/step-nine.component";
// import { RoofComponent } from "./roof/roof.component";
// import { ExteriorComponent } from "./exterior/exterior.component";
import { StepOneComponent } from "./step-one/step-one.component";
import { InitialInfoForm } from "./components/waleed/initial-info-form/initial-info-form.component";

import { ChatComponent } from "./chat/chat.component";
import { AboutComponent } from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { EditCoverageComponent } from "./components/waleed/edit-coverage/edit-coverage.component";
import { DemoPageP2Component } from "./components/waleed/demo-page-p2/demo-page-p2.component";
import { CourseRelation } from "./components/waleed/course-relation/course-relation.component";
import { BatchPageComponent } from "./components/batch-page/batch-page.component";
import { AddCodePageComponent } from "./components/add-code-page/add-code-page.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { BulkListComponent } from "./components/bulk-list/bulk-list.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { PreparingPolicyComponent } from "./components/preparing-policy/preparing-policy.component";
// import { PolicyStartDateComponent } from "./components/policy-start-date/policy-start-date.component";
import { PolicyHaveMortgageComponent } from "./components/policy-have-mortgage/policy-have-mortgage.component";
import { PolicyMortgageInfoComponent } from "./components/policy-mortgage-info/policy-mortgage-info.component";
import { PolicyOlarkChatComponent } from "./components/policy-olark-chat/policy-olark-chat.component";
// import { HavenInputsComponent } from "./components/haven-inputs/haven-inputs.component";
// import { HavenResultComponent } from "./components/haven-result/haven-result.component";
import { PropertyFormComponent } from "./property-form/property-form.component";
import { InsuranceDetailComponent } from "./insurance-detail/insurance-detail.component";

const routes: Routes = [
  {
    path: "step1",
    component: StepOneComponent,
    data: {
      animation: "StepOne",
    },
  },
  {
    path: "initial-info-form",
    component: InitialInfoForm,
    data: {
      animation: "StepOne",
    },
  },
  {
    path: "step2",
    component: StepTwoComponent,
    data: {
      animation: "StepTwo",
    },
  },
  {
    path: "step3",
    component: PropertyFormComponent,
    data: {
      animation: "StepThree",
    },
  },
  // {
  //   path: "roof",
  //   component: RoofComponent,
  //   data: {
  //     animation: "Roof",
  //   },
  // },
  // {
  //   path: "exterior",
  //   component: ExteriorComponent,
  //   data: {
  //     animation: "Exterior",
  //   },
  // },
  // {
  //   path: "step4",
  //   component: StepFourComponent,
  //   data: {
  //     animation: "StepFour",
  //   },
  // },
  // {
  //   path: "step5",
  //   component: StepFiveComponent,
  //   data: {
  //     animation: "StepFive",
  //   },
  // },
  {
    path: "course-relation",
    component: CourseRelation,
    data: {
      animation: "CourseRelation",
    },
  },
  {
    path: "step6",
    component: StepSixComponent,
    data: {
      animation: "StepSix",
    },
  },
  {
    path: "preparing-policy",
    component: PreparingPolicyComponent,
    data: {
      animation: "PreparingPolicy",
    },
  },
  {
    path: "policy-start-date",
    //component: PolicyStartDateComponent,
    component: InsuranceDetailComponent,
    data: {
      animation: "PolicyStartDate",
    },
  },
  {
    path: "policy-have-mortgage",
    component: PolicyHaveMortgageComponent,
    data: {
      animation: "PolicyHaveMortgage",
    },
  },
  {
    path: "policy-mortgage-info",
    component: PolicyMortgageInfoComponent,
    data: {
      animation: "PolicyMortgageInfo",
    },
  },
  {
    path: "policy-chat",
    component: PolicyOlarkChatComponent,
    data: {
      animation: "PolicyOlarkChat",
    },
  },
  // {
  //   path: "step7",
  //   component: StepSevenComponent,
  //   data: {
  //     animation: "StepSeven",
  //   },
  // },
  // {
  //   path: "step8",
  //   component: StepEightComponent,
  //   data: {
  //     animation: "StepEight",
  //   },
  // },
  // {
  //   path: "step9",
  //   component: StepNineComponent,
  //   data: {
  //     animation: "StepNine",
  //   },
  // },
  // {
  //   path: "haven-inputs",
  //   component: HavenInputsComponent,
  //   data: {
  //     animation: "HavenInputs",
  //   },
  // },
  // {
  //   path: "haven-result",
  //   component: HavenResultComponent,
  //   data: {
  //     animation: "HavenResult",
  //   },
  // },
  { path: "esign", component: EsignComponent },
  { path: "about", component: AboutComponent },
  { path: "contact", component: ContactComponent },
  { path: "chat", component: ChatComponent },
  { path: "retrieve", component: RetrieveComponent },
  { path: "edit-coverage", component: EditCoverageComponent },
  { path: "demopage", component: DemoPageP2Component },

  { path: "add", component: AddCodePageComponent },
  { path: "batch", component: BatchPageComponent },
  { path: "users", component: UserListComponent },
  { path: "history", component: BulkListComponent },
  { path: "users/:id", component: UserDetailsComponent },

  { path: "", redirectTo: "/step1", pathMatch: "full" },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, { useHash: false })],
})
export class AppRoutingModule {}

/*comment*/
