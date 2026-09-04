Feature: Filing Status Check

  Scenario Outline: Check filing status for different regulator responses
    Given the regulator will respond with "<mockedStatus>"
    When I check the status
    Then I should see the status "<expectedStatus>"

    Examples:
      | mockedStatus | expectedStatus |
      | Accepted     | Accepted       |
      | Rejected     | Rejected       |
      | ServerError  | Error          |