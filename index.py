# Sample data for employer management system
students = [
    {"id": 1, "name": "John Smith", "department": "Engineering", "position": "Software Developer", "salary": 75000},
    {"id": 2, "name": "Sarah Johnson", "department": "Marketing", "position": "Marketing Manager", "salary": 65000},
    {"id": 3, "name": "Mike Davis", "department": "HR", "position": "HR Specialist", "salary": 55000},
    {"id": 4, "name": "Emily Brown", "department": "Finance", "position": "Financial Analyst", "salary": 60000}
]

print("Current employees:")
for student in students:
    print(f"ID: {student['id']}, Name: {student['name']}, Department: {student['department']}, Position: {student['position']}, Salary: ${student['salary']}")

print("\nSelect operation:")
print("1. Append - Add employee at the end")
print("2. Insert - Add employee at specific position")
print("3. Pop - Remove employee from end or specific position")
print("4. Remove - Remove employee at specific position")
print("5. Clear - Remove all employees")

choice = input("Enter your choice (1-5): ")

if choice == "1":
    # Append operation
    name = input("Enter employee name: ")
    department = input("Enter department: ")
    position = input("Enter position: ")
    salary = int(input("Enter salary: "))
    new_id = max([emp['id'] for emp in students]) + 1 if students else 1
    
    new_employee = {"id": new_id, "name": name, "department": department, "position": position, "salary": salary}
    students.append(new_employee)
    print(f"Employee {name} added successfully!")

elif choice == "2":
    # Insert operation
    position_index = int(input(f"Enter position to insert (0-{len(students)}): "))
    name = input("Enter employee name: ")
    department = input("Enter department: ")
    position = input("Enter position: ")
    salary = int(input("Enter salary: "))
    new_id = max([emp['id'] for emp in students]) + 1 if students else 1
    
    new_employee = {"id": new_id, "name": name, "department": department, "position": position, "salary": salary}
    students.insert(position_index, new_employee)
    print(f"Employee {name} inserted at position {position_index}!")

elif choice == "3":
    # Pop operation
    if not students:
        print("No employees to remove!")
    else:
        pop_choice = input("Remove from end? (y/n): ")
        if pop_choice.lower() == "y":
            removed_employee = students.pop()
            print(f"Removed employee: {removed_employee['name']}")
        else:
            position_index = int(input(f"Enter position to remove (0-{len(students)-1}): "))
            removed_employee = students.pop(position_index)
            print(f"Removed employee: {removed_employee['name']} from position {position_index}")

elif choice == "4":
    # Remove at specific position
    if not students:
        print("No employees to remove!")
    else:
        position_index = int(input(f"Enter position to remove (0-{len(students)-1}): "))
        removed_employee = students.pop(position_index)
        print(f"Removed employee: {removed_employee['name']} from position {position_index}")

elif choice == "5":
    # Clear operation
    students.clear()
    print("All employees removed!")

else:
    print("Invalid choice!")

print("\nUpdated employee list:")
if students:
    for student in students:
        print(f"ID: {student['id']}, Name: {student['name']}, Department: {student['department']}, Position: {student['position']}, Salary: ${student['salary']}")
else:
    print("No employees in the system.")
