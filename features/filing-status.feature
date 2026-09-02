Feature: Filling Status check
    As a QA Engineer
    I want to Check the status of Regulatory Filling
    So that I can confirm it was submitted successfully

    Scenario: Successfully view filling status
        Given I am on the filing status page
        When I check the status
        Then I should see the status "Accepted"