'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface VariableItem {
  key: string;
  value: string;
}

// Константа для префикса
const VARIABLE_PREFIX = "REST_VAR_";

export default function VariablesForm() {
  const [variable, setVariable] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [variablesList, setVariablesList] = useState<VariableItem[]>([]);

  // Загружаем переменные из localStorage при монтировании компонента
  useEffect(() => {
    const savedVariables: VariableItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i); // Полный ключ, например, "REST_VAR_api_key"
      if (fullKey && fullKey.startsWith(VARIABLE_PREFIX)) {
        const displayName = fullKey.replace(VARIABLE_PREFIX, ""); // Убираем префикс для отображения
        const value = localStorage.getItem(fullKey) || "";
        savedVariables.push({ key: displayName, value });
      }
    }
    setVariablesList(savedVariables);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!variable.trim()) {
      alert("Variable name cannot be empty.");
      return;
    }

    const storageKey = VARIABLE_PREFIX + variable;
    localStorage.setItem(storageKey, value);

    // Обновляем локальный стейт
    setVariablesList((prev) => {
      const exists = prev.find((item) => item.key === variable);
      if (exists) {
        // Если переменная уже существует, обновляем ее значение
        return prev.map((item) =>
          item.key === variable ? { ...item, value: value } : item
        );
      } else {
        // Если новая переменная, добавляем ее в список
        return [...prev, { key: variable, value: value }];
      }
    });
    // Очищаем поля ввода после успешного сохранения
    setVariable("");
    setValue("");
    alert(`Variable "${variable}" saved successfully!`);
  }

  // Обработчик удаления переменной
  const handleDelete = (keyToDelete: string) => {
    // Удаляем из localStorage
    const storageKey = VARIABLE_PREFIX + keyToDelete;
    localStorage.removeItem(storageKey);

    // Удаляем из локального стейта
    setVariablesList((prev) => prev.filter((item) => item.key !== keyToDelete));

    alert(`Variable "${keyToDelete}" deleted.`);
  };

  return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Variables</CardTitle>
          <p className="text-sm text-muted-foreground">
          Define variables to use in your requests (e.g., <code>{"{{variableName}}"}</code> in URL, headers, or body).
        </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div className="flex gap-2 items-end mb-5">
              <div className="grid gap-2">
                <Label htmlFor="variable">Variable Name</Label>
                <Input
                  id="variable" 
                  type="text" 
                  placeholder="Enter variable"
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  required
                  className="flex-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value</Label>
                <Input 
                  type="text" 
                  placeholder="Enter value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  className="flex-1"
                />
              </div>
            <Button
              type="submit"
            >
              Save
            </Button>
            </div>


          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Variable</th>
                  <th className="px-4 py-2 text-left font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {variablesList.length > 0 ?
                variablesList.map((item) => (
                  <tr key={item.key}>
                    <td className="font-medium">
                      <code>{"{{" + item.key + "}}"}</code>
                    </td>
                    <td className="text-sm">
                      <span className="truncate block max-w-xs md:max-w-md">
                        {item.value}
                      </span>
                    </td>
                    <td className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.key)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                  <td colSpan={3} className="h-24 text-center">
                    No variables found. Add one above!
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
}