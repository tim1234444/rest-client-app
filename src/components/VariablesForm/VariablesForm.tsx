'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface VariableItem {
  varName: string;
  varValue: string;
}

interface VariablesFormProps {
  id: string | undefined;
}

export default function VariablesForm({ id = '' }: VariablesFormProps) {
  const [variable, setVariable] = useState('');
  const [value, setValue] = useState('');
  const [variablesList, setVariablesList] = useState<VariableItem[]>([]);

  // Загружаем переменные из localStorage при монтировании компонента
  useEffect(() => {
    const historyValue = JSON.parse(localStorage.getItem(id));
    if (historyValue) setVariablesList(historyValue);
    if (!historyValue) setVariablesList([]);
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (variable && value && id) {
      const varObj = {
        varName: variable,
        varValue: value,
      };

      const varFilter = variablesList.filter((key) => key.varName === varObj.varName);

      if (varFilter.length > 0) {
        const filterVar = variablesList.map((v) => {
          if (varObj.varName === v.varName) {
            v.varValue = varObj.varValue;
            return v;
          }
          return v;
        });
        setVariablesList(filterVar);
      }

      if (varFilter.length === 0) {
        variablesList.push(varObj);
      }

      localStorage.setItem(id, JSON.stringify(variablesList));
    }

    setVariable('');
    setValue('');
  };

  // Обработчик удаления переменной
  const handleDelete = (keyToDelete: string) => {
    // Удаляем из локального стейта
    setVariablesList((prev) => {
      const removeItem = prev.filter((item) => item.varName !== keyToDelete);
      localStorage.setItem(id, JSON.stringify(removeItem));
      return removeItem;
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Variables</CardTitle>
        <p className="text-sm text-muted-foreground">
          Define variables to use in your requests (e.g., <code>{'{{variableName}}'}</code> in URL,
          headers or body).
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
                placeholder="Enter variable name"
                value={variable}
                onChange={(e) => setVariable(e.target.value.trim())}
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
                onChange={(e) => setValue(e.target.value.trim())}
                required
                className="flex-1"
              />
            </div>
            <Button type="submit">Save</Button>
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
              {variablesList.length > 0 ? (
                variablesList.map((item) => (
                  <tr key={item.varName}>
                    <td className="font-medium p-2">
                      <span>{item.varName}</span>
                    </td>
                    <td className="text-sm p-2">
                      <span className="truncate block max-w-xs md:max-w-md">{item.varValue}</span>
                    </td>
                    <td className="text-right">
                      <Button size="sm" onClick={() => handleDelete(item.varName)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
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
