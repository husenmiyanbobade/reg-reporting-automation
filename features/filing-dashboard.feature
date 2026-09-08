@dashboard
Feature: Filing Dashboard

  Scenario: Verify multiple filing statuses at once
    Given the following reports exist:
      | reportId | status   |
      | RPT-001  | Accepted |
      | RPT-002  | Rejected |
      | RPT-003  | Pending  |
    When I view the filing dashboard
    Then all reports should show their correct status